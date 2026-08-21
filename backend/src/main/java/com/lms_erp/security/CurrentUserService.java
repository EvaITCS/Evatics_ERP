package com.lms_erp.security;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final EmployeeRepository employeeRepository;
    private final StudentApplicationRepository studentApplicationRepository;
    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;


    // =====================================================
    // CURRENT USER
    // =====================================================

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Authenticated user not found"
                        ));
    }


    // =====================================================
    // CURRENT USER ID
    // =====================================================

    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }


    // =====================================================
    // CHECK ROLE
    // =====================================================

    public boolean hasRole(String roleName) {

        return userRoleRepository
                .findAllByUserUserId(getCurrentUserId())
                .stream()
                .anyMatch(userRole ->
                        userRole.getRole()
                                .getRoleName()
                                .equalsIgnoreCase(roleName)
                );
    }


    // =====================================================
    // CURRENT EMPLOYEE
    //
    // Used by ADMIN / COUNSELLOR notifications
    // =====================================================

    public Employee getCurrentEmployee() {

        User user = getCurrentUser();

        if (user.getPerson() == null ||
                user.getPerson().getPersonId() == null) {

            throw new RuntimeException(
                    "Person is not associated with logged-in user."
            );
        }

        return employeeRepository
                .findById(
                        user.getPerson().getPersonId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"
                        )
                );
    }


    // =====================================================
    // CURRENT STUDENT APPLICATION
    //
    // IMPORTANT:
    // There is NO Student entity in this project.
    //
    // Student is represented by StudentApplication.
    // PK = person_id
    // =====================================================

    public StudentApplication getCurrentStudentApplication() {

        User user = getCurrentUser();

        if (user.getPerson() == null ||
                user.getPerson().getPersonId() == null) {

            throw new RuntimeException(
                    "Person is not associated with logged-in user."
            );
        }

        return studentApplicationRepository
                .findByPersonPersonId(
                        user.getPerson().getPersonId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student application not found"
                        )
                );
    }


    // =====================================================
    // CURRENT PERSON ID
    // =====================================================

    public Long getCurrentPersonId() {

        User user = getCurrentUser();

        if (user.getPerson() == null ||
                user.getPerson().getPersonId() == null) {

            throw new RuntimeException(
                    "Person is not associated with logged-in user."
            );
        }

        return user.getPerson().getPersonId();
    }


    // =====================================================
    // PRIMARY EMAIL
    // =====================================================

    public String getCurrentUserPrimaryEmail() {

        Person person = getCurrentUser().getPerson();

        ContactTypeMaster type =
                contactTypeMasterRepository
                        .findByContactTypeName("PRIMARY_EMAIL")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PRIMARY_EMAIL not found"
                                )
                        );

        return personContactRepository
                .findByPersonAndContactType(
                        person,
                        type
                )
                .map(PersonContact::getContactValue)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Primary email not found"
                        )
                );
    }


    // =====================================================
    // PRIMARY PHONE
    // =====================================================

    public String getCurrentUserPrimaryPhone() {

        Person person = getCurrentUser().getPerson();

        ContactTypeMaster type =
                contactTypeMasterRepository
                        .findByContactTypeName("PRIMARY_PHONE")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PRIMARY_PHONE not found"
                                )
                        );

        return personContactRepository
                .findByPersonAndContactType(
                        person,
                        type
                )
                .map(PersonContact::getContactValue)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Primary phone not found"
                        )
                );
    }
}