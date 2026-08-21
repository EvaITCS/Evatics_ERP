package com.lms_erp.auth.service;

import com.lms_erp.auth.dto.AuthResponse;
import com.lms_erp.auth.dto.LoginRequest;
import com.lms_erp.auth.dto.RegisterRequest;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.exception.HttpException;
import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.*;
import com.lms_erp.security.CustomUserDetailsService;
import com.lms_erp.security.JwtUtil;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.invitation.ApplicationInvitationToken;
import com.lms_erp.student.invitation.InvitationTokenService;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.user.entity.Role;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.RoleRepository;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    // =====================================
    // REPOSITORIES
    // =====================================

    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeRepository;
    private final PersonTypeRepository personTypeRepository;
    private final PersonTypeMapRepository personTypeMapRepository;
    private final EmployeeRepository employeeRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CustomUserDetailsService customUserDetailsService;
    private final StudentApplicationRepository studentApplicationRepository;
    private final InvitationTokenService invitationTokenService;

    // =====================================
    // REGISTER
    // =====================================
    public AuthResponse register(RegisterRequest req) {

        // =====================================================
        // EMAIL ALREADY EXISTS
        // =====================================================

        if (personContactRepository.existsByContactValue(req.getEmail())) {
            throw HttpException.conflict(
                    "An account with this email already exists. Please login or use another email."
            );
        }

        // =====================================================
        // PASSWORD VALIDATION
        // =====================================================

        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw HttpException.badRequest("Password is required");
        }

        if (req.getConfirmPassword() == null || req.getConfirmPassword().isBlank()) {
            throw HttpException.badRequest("Confirm Password is required");
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw HttpException.badRequest("Passwords do not match");
        }

        if (req.getPassword().length() < 8) {
            throw HttpException.badRequest("Password must be at least 8 characters");
        }

        // =====================================================
        // CREATE PERSON
        // =====================================================

        Person person = new Person();

        person.setFirstName(req.getFirstName());
        person.setMiddleName(req.getMiddleName());
        person.setLastName(req.getLastName());

        personRepository.save(person);
        ContactTypeMaster emailType = contactTypeRepository
                .findByContactTypeName("PRIMARY_EMAIL")
                .orElseThrow(() ->
                        new RuntimeException("EMAIL contact type not found"));

        PersonContact emailContact = new PersonContact();

        emailContact.setPerson(person);
        emailContact.setContactType(emailType);
        emailContact.setContactValue(req.getEmail());
        emailContact.setIsPrimary(true);

        personContactRepository.save(emailContact);

        if (req.getPhone() != null && !req.getPhone().isBlank()) {

            ContactTypeMaster phoneType = contactTypeRepository
                    .findByContactTypeName("PRIMARY_PHONE")
                    .orElseThrow(() ->
                            new RuntimeException("PHONE contact type not found"));

            PersonContact phoneContact = new PersonContact();

            phoneContact.setPerson(person);
            phoneContact.setContactType(phoneType);
            phoneContact.setContactValue(req.getPhone());
            phoneContact.setIsPrimary(true);

            personContactRepository.save(phoneContact);
        }

        // =====================================================
        // PERSON TYPE
        // =====================================================

        PersonType personType =
                personTypeRepository
                        .findByTypeName("CANDIDATE")
                        .orElseThrow(() ->
                                HttpException.notFound("Person type not found")
                        );

        // =====================================================
        // MAP PERSON TYPE
        // =====================================================

        PersonTypeMap map = new PersonTypeMap();

        map.setPerson(person);
        map.setPersonType(personType);

        personTypeMapRepository.save(map);

        // =====================================================
        // CREATE USER
        // =====================================================

        User user = new User();

        user.setUsername(req.getEmail());

        // Store BCrypt Password
        user.setPassword(
                passwordEncoder.encode(req.getPassword())
        );

        user.setPerson(person);

        user.setFailedAttempts(0);
        user.setIsLocked(false);
        user.setIsActive(true);
        user.setLastLogin(null);

        user.setMustChangePassword(false);

        user.setPasswordChangedAt(LocalDateTime.now());

        userRepository.save(user);

        // =====================================================
        // DEFAULT ROLE
        // =====================================================

        Role role = roleRepository
                .findByRoleName("CANDIDATE")
                .orElseThrow(() ->
                        HttpException.notFound("Candidate role not found")
                );

        // =====================================================
        // USER ROLE
        // =====================================================

        UserRole userRole = new UserRole();

        userRole.setUser(user);
        userRole.setRole(role);

        userRoleRepository.save(userRole);

        // =====================================================
        // RESPONSE
        // =====================================================

        return AuthResponse.builder()
                .message("Registered Successfully")
                .role(role.getRoleName())
                .build();
    }

    // =====================================
    // LOGIN
    // =====================================

    public AuthResponse login(LoginRequest req) {

        // =====================================
        // FIND USER
        // =====================================

        User user =
                userRepository
                        .findByUsername(
                                req.getEmail()
                        )
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid email or password"
                                )
                        );

        // =====================================
        // ACCOUNT LOCK CHECK
        // =====================================

        if (Boolean.TRUE.equals(user.getIsLocked())) {
            throw HttpException.unauthorized(
                    "Account Locked. Please contact Administrator."
            );
        }

        // =====================================
        // PASSWORD CHECK
        // =====================================

        String storedPassword = user.getPassword();

        boolean passwordCorrect;

        // FIRST LOGIN PASSWORD MIGRATION
        // BCrypt password check
        if (storedPassword.startsWith("$2a$")
                || storedPassword.startsWith("$2b$")
                || storedPassword.startsWith("$2y$")) {

            passwordCorrect =
                    passwordEncoder.matches(
                            req.getPassword(),
                            storedPassword
                    );

        } else {

            // First login (plain text password)
            passwordCorrect =
                    storedPassword.equals(req.getPassword());

            // Convert plain password to BCrypt after first successful login
            if (passwordCorrect) {

                user.setPassword(
                        passwordEncoder.encode(req.getPassword())
                );

                userRepository.save(user);
            }
        }

        if (!passwordCorrect) {

            Integer attempts =
                    user.getFailedAttempts() == null
                            ? 0
                            : user.getFailedAttempts();

            attempts++;

            user.setFailedAttempts(attempts);

            if (attempts >= 3) {

                user.setIsLocked(true);

                userRepository.save(user);

                throw HttpException.unauthorized(
                        "Account Locked. Please contact Administrator."
                );
            }

            userRepository.save(user);

            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        // =====================================
        // RESET FAILED ATTEMPTS
        // =====================================

        user.setFailedAttempts(0);

        user.setIsLocked(false);

        user.setLastLogin(java.time.LocalDateTime.now());

        userRepository.save(user);

        // =====================================
        // USER ROLE
        // =====================================

        List<UserRole> userRoles =
                userRoleRepository.findAllByUserUserId(user.getUserId());

        if (userRoles.isEmpty()) {
            throw new RuntimeException("No role assigned to user");
        }

        if (userRoles.size() > 1) {
            throw new RuntimeException(
                    "User has multiple roles configured. Please contact Administrator."
            );
        }
        String roleName =
                userRoles.get(0)
                        .getRole()
                        .getRoleName();

        // =====================================
        // MUST CHANGE PASSWORD WITHOUT INVITATION
        // =====================================

        if ("LEAD".equalsIgnoreCase(roleName)
                && Boolean.TRUE.equals(user.getMustChangePassword())
                && (req.getInvitationToken() == null
                || req.getInvitationToken().isBlank())) {

            throw HttpException.forbidden(
                    "Password must be changed through the invitation link."
            );
        }

        // =====================================
        // INVITATION SECURITY
        // =====================================

        if (req.getInvitationToken() != null
                && !req.getInvitationToken().isBlank()) {

            if (!"LEAD".equalsIgnoreCase(roleName)) {
                throw HttpException.forbidden(
                        "Only Lead can login using an invitation link."
                );
            }

            ApplicationInvitationToken invitationToken =
                    invitationTokenService.validateToken(
                            req.getInvitationToken()
                    );

            StudentApplication invitedApplication =
                    invitationToken.getStudentApplication();

            StudentApplication loginApplication =
                    studentApplicationRepository
                            .findByPerson(user.getPerson())
                            .orElseThrow(() ->
                                    HttpException.forbidden(
                                            "This invitation does not belong to this account."
                                    ));

            if (!java.util.Objects.equals(
                    invitedApplication.getPersonId(),
                    loginApplication.getPersonId())) {

                throw HttpException.forbidden(
                        "This invitation does not belong to this account."
                );
            }
        }

        // =====================================
        // GENERATE JWT TOKEN
        // =====================================
        UserDetails userDetails =
                customUserDetailsService
                        .loadUserByUsername(
                                user.getUsername()
                        );

        String token =
                jwtUtil.generateToken(
                        userDetails
                );

        // =====================================
// PERSON ID
// =====================================

        Long personId = user.getPerson().getPersonId();
        // =====================================
        // RESPONSE
        // =====================================
        return AuthResponse.builder()

                .message(
                        "Login Success"
                )

                .token(
                        token
                )

                .role(
                        roleName
                )

                .userId(
                        user.getUserId()
                )


                .personId(personId)
                .firstName(user.getPerson().getFirstName())
                .lastName(user.getPerson().getLastName())
                .fullName(
                        user.getPerson().getFirstName() + " " +
                                user.getPerson().getLastName()
                )
                .mustChangePassword(user.getMustChangePassword())
                .build();
    }

    public AuthResponse getCurrentUser() {

        // =====================================================
        // GET AUTHENTICATED USER
        // =====================================================

        UserDetails userDetails =
                (UserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user =
                userRepository
                        .findByUsername(userDetails.getUsername())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // =====================================================
        // GET USER ROLE
        // =====================================================

        List<UserRole> userRoles =
                userRoleRepository.findAllByUserUserId(
                        user.getUserId()
                );

        String role =
                userRoles.isEmpty()
                        ? null
                        : userRoles.get(0)
                        .getRole()
                        .getRoleName();


        // =====================================================
        // PERSON ID
        // =====================================================

        Long personId =
                user.getPerson() != null
                        ? user.getPerson().getPersonId()
                        : null;


        // =====================================================
        // FULL NAME
        // =====================================================

        String firstName =
                user.getPerson() != null
                        ? user.getPerson().getFirstName()
                        : "";

        String lastName =
                user.getPerson() != null
                        ? user.getPerson().getLastName()
                        : "";

        String fullName =
                (firstName + " " + lastName).trim();


        // =====================================================
        // RESPONSE
        // =====================================================

        return AuthResponse.builder()

                .message("Current User")

                .userId(
                        user.getUserId()
                )

                .personId(
                        personId
                )

                .role(
                        role
                )

                .firstName(
                        firstName
                )

                .lastName(
                        lastName
                )

                .fullName(
                        fullName
                )

                // =============================================
                // IMPORTANT
                // =============================================

                .mustChangePassword(
                        Boolean.TRUE.equals(
                                user.getMustChangePassword()
                        )
                )

                .build();
    }
}