package com.lms_erp.user.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.exception.HttpException;
import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.user.dto.ChangePasswordRequest;
import com.lms_erp.user.dto.UserDto;
import com.lms_erp.user.dto.UserSecurityDto;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;
    private final StudentApplicationRepository studentApplicationRepository;
    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;

    // =====================================
    // GET ALL CONSULTANTS
    // =====================================

    // =====================================
// GET ALL COUNSELLORS
// =====================================

    public List<UserDto> getAllCounsellors() {

        return userRoleRepository
                .findByRole_RoleName("COUNSELLOR")
                .stream()
                .map(userRole -> {

                    User user = userRole.getUser();

                    String fullName = "";

                    if (user.getPerson() != null) {
                        fullName = user.getPerson().getFirstName()
                                + " "
                                + user.getPerson().getLastName();
                    }

                    return UserDto.builder()
                            .userId(user.getUserId())
                            .username(user.getUsername())
                            .fullName(fullName)
                            .build();
                })
                .toList();
    }
    // =====================================
    // GET ALL LOCKED USERS
    // =====================================

    public List<UserSecurityDto> getLockedUsers() {

        return userRepository.findByIsLockedTrue()
                .stream()
                .map(user -> {

                    String fullName = "";
                    String email = "";
                    String role = "";
                    Long employeeId = null;

                    if (user.getPerson() != null) {

                        fullName = user.getPerson().getFirstName()
                                + " "
                                + user.getPerson().getLastName();

                        email = getPrimaryEmail(user.getPerson());
                    }

                    List<UserRole> userRoles =
                            userRoleRepository.findAllByUserUserId(
                                    user.getUserId()
                            );

                    if (!userRoles.isEmpty()) {
                        role = userRoles.get(0)
                                .getRole()
                                .getRoleName();
                    }

                    Employee employee =
                            employeeRepository
                                    .findByPersonPersonId(
                                            user.getPerson().getPersonId()
                                    )
                                    .orElse(null);



                    if (employee != null) {
                        employeeId = employee.getPersonId();
                    }

                    StudentApplication application =
                            studentApplicationRepository
                                    .findByPerson(user.getPerson())
                                    .orElse(null);

                    Long personId = null;

                    if (application != null) {
                        personId = application.getPersonId();
                    }

                    return UserSecurityDto.builder()
                            .userId(user.getUserId())

                            .personId(personId)
                            .fullName(fullName)
                            .email(email)
                            .role(role)
                            .isLocked(user.getIsLocked())
                            .failedAttempts(user.getFailedAttempts())
                            .build();
                })
                .toList();
    }

    // =====================================
    // CHANGE PASSWORD
    // =====================================

    public void changePassword(ChangePasswordRequest request) {

        User user = currentUserService.getCurrentUser();

        if (request.getOldPassword() != null &&
                !request.getOldPassword().isBlank()) {

            String storedPassword = user.getPassword();

            boolean passwordCorrect;

            if (storedPassword.startsWith("$2a$")
                    || storedPassword.startsWith("$2b$")
                    || storedPassword.startsWith("$2y$")) {

                passwordCorrect = passwordEncoder.matches(
                        request.getOldPassword(),
                        storedPassword
                );

            } else {

                passwordCorrect = storedPassword.equals(
                        request.getOldPassword()
                );
            }

            if (!passwordCorrect) {
                throw new BadCredentialsException("Old Password Incorrect");
            }
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setMustChangePassword(false);
        user.setPasswordChangedAt(java.time.LocalDateTime.now());

        userRepository.save(user);
    }

    // =====================================
    // UNLOCK USER
    // =====================================

    public void unlockUser(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        HttpException.notFound("User not found")
                );

        user.setIsLocked(false);
        user.setFailedAttempts(0);

        userRepository.save(user);
    }

    // =====================================
    // HELPER: GET PRIMARY EMAIL
    // =====================================

    private String getPrimaryEmail(Person person) {

        if (person == null) {
            return "";
        }

        ContactTypeMaster type =
                contactTypeMasterRepository
                        .findByContactTypeName("PRIMARY_EMAIL")
                        .orElseThrow(() ->
                                new RuntimeException("PRIMARY_EMAIL not found"));

        return personContactRepository
                .findByPersonAndContactType(person, type)
                .map(PersonContact::getContactValue)
                .orElse("");
    }
}