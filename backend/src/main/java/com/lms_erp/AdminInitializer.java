package com.lms_erp;

import com.lms_erp.employee.entity.Department;
import com.lms_erp.employee.entity.Designation;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.entity.EmployeeStatusMaster;
import com.lms_erp.employee.repository.DepartmentRepository;
import com.lms_erp.employee.repository.DesignationRepository;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.employee.repository.EmployeeStatusRepository;
import com.lms_erp.config.properties.AdminConfigProperties;
import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.user.entity.Role;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.RoleRepository;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@EnableConfigurationProperties(AdminConfigProperties.class)
public class AdminInitializer implements CommandLineRunner {

    // =====================================================
    // REPOSITORIES
    // =====================================================

    private final UserRepository userRepository;
    private final PersonRepository personRepository;

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeStatusRepository employeeStatusRepository;

    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    private final PasswordEncoder passwordEncoder;

    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;

    // =====================================================
    // ADMIN CONFIGURATION
    // =====================================================

    @Value("${admin.temp.username}")
    private String adminEmail;

    @Value("${admin.temp.password}")
    private String adminPassword;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminInitializer(
            UserRepository userRepository,
            PersonRepository personRepository,
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            EmployeeStatusRepository employeeStatusRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder,
            PersonContactRepository personContactRepository,
            ContactTypeMasterRepository contactTypeMasterRepository
    ) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.employeeStatusRepository = employeeStatusRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.personContactRepository = personContactRepository;
        this.contactTypeMasterRepository = contactTypeMasterRepository;
    }

    // =====================================================
    // INITIALIZER
    // =====================================================

    @Override
    @Transactional
    public void run(String... args) {

        log.info("==========================================");
        log.info("Checking Bootstrap Admin Employee");
        log.info("==========================================");

        // =================================================
        // 1. FIND ADMIN ROLE
        // =================================================

        Role adminRole = roleRepository
                .findByRoleName("ADMIN")
                .orElseThrow(() ->
                        new RuntimeException(
                                "ADMIN role not found"
                        )
                );

        // =================================================
        // 2. FIND OR CREATE ADMIN DEPARTMENT
        // =================================================

        Department department =
                departmentRepository
                        .findByDepartmentName("Administration")
                        .orElseGet(() -> {

                            Department newDepartment =
                                    Department.builder()
                                            .departmentName(
                                                    "Administration"
                                            )
                                            .description(
                                                    "System administration department"
                                            )
                                            .build();

                            return departmentRepository.save(
                                    newDepartment
                            );
                        });

        // =================================================
        // 3. FIND OR CREATE ACTIVE STATUS
        // =================================================

        EmployeeStatusMaster employeeStatus =
                employeeStatusRepository
                        .findByStatusName("ACTIVE")
                        .orElseGet(() -> {

                            EmployeeStatusMaster status =
                                    EmployeeStatusMaster.builder()
                                            .statusName("ACTIVE")
                                            .build();

                            return employeeStatusRepository.save(
                                    status
                            );
                        });

        // =================================================
        // 4. FIND OR CREATE ADMIN DESIGNATION
        // =================================================

        Designation designation =
                designationRepository
                        .findByDesignationName(
                                "System Administrator"
                        )
                        .orElseGet(() -> {

                            Designation newDesignation =
                                    Designation.builder()
                                            .designationName(
                                                    "System Administrator"
                                            )
                                            .designationLevel(
                                                    "ADMIN"
                                            )
                                            .role(adminRole)
                                            .build();

                            return designationRepository.save(
                                    newDesignation
                            );
                        });

        // =================================================
        // 5. FIND USER BY ADMIN EMAIL
        // =================================================

        User user =
                userRepository
                        .findByUsername(adminEmail)
                        .orElse(null);

        Person person;

        // =================================================
        // 6. CREATE PERSON + USER IF NOT EXISTS
        // =================================================

        if (user == null) {

            // =============================================
            // CREATE PERSON
            // =============================================

            person = new Person();

            person.setFirstName("System");
            person.setLastName("Administrator");

            person = personRepository.save(person);

            log.info(
                    "System Person created. personId={}",
                    person.getPersonId()
            );

            // =============================================
            // PRIMARY EMAIL
            // =============================================

            ContactTypeMaster emailType =
                    contactTypeMasterRepository
                            .findByContactTypeNameIgnoreCase(
                                    "PRIMARY_EMAIL"
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "PRIMARY_EMAIL contact type not found"
                                    )
                            );

            PersonContact emailContact =
                    new PersonContact();

            emailContact.setPerson(person);
            emailContact.setContactType(emailType);
            emailContact.setContactValue(adminEmail);
            emailContact.setIsPrimary(true);

            personContactRepository.save(
                    emailContact
            );

            // =============================================
            // PRIMARY PHONE
            // =============================================

            ContactTypeMaster phoneType =
                    contactTypeMasterRepository
                            .findByContactTypeNameIgnoreCase(
                                    "PRIMARY_PHONE"
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "PRIMARY_PHONE contact type not found"
                                    )
                            );

            PersonContact phoneContact =
                    new PersonContact();

            phoneContact.setPerson(person);
            phoneContact.setContactType(phoneType);
            phoneContact.setContactValue("9999999999");
            phoneContact.setIsPrimary(true);

            personContactRepository.save(
                    phoneContact
            );

            // =============================================
            // CREATE USER
            // =============================================

            user = new User();

            user.setPerson(person);

            // ADMIN EMAIL = USERNAME
            user.setUsername(adminEmail);

            // ADMIN PASSWORD FROM APPLICATION.PROPERTIES
            user.setPassword(
                    passwordEncoder.encode(adminPassword)
            );

            user.setIsActive(true);
            user.setIsLocked(false);
            user.setFailedAttempts(0);

            // First login password change
            user.setMustChangePassword(true);
            user.setPasswordChangedAt(null);

            user = userRepository.save(user);

            log.info(
                    "Admin User created. userId={}",
                    user.getUserId()
            );

        } else {

            // =================================================
            // USER ALREADY EXISTS
            // =================================================

            person = user.getPerson();

            if (person == null) {

                throw new RuntimeException(
                        "Admin user exists but Person is missing"
                );
            }

            log.info(
                    "Admin User already exists. userId={}",
                    user.getUserId()
            );
        }

        // =================================================
        // 7. CREATE EMPLOYEE IF MISSING
        // =================================================

        Employee employee =
                employeeRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
                        .orElse(null);

        if (employee == null) {

            employee =
                    Employee.builder()
                            .person(person)
                            .employeeCode("SYSTEM-001")
                            .joiningDate(LocalDate.now())
                            .probationEndDate(null)
                            .isMarried(false)
                            .department(department)
                            .designation(designation)
                            .employmentType("Permanent")
                            .employeeStatus(employeeStatus)
                            .workMode(null)
                            .shift(null)
                            .location(null)
                            .build();

            employee =
                    employeeRepository.save(employee);

            log.info(
                    "=========================================="
            );

            log.info(
                    "Bootstrap Employee Created"
            );

            log.info(
                    "Employee Code : {}",
                    employee.getEmployeeCode()
            );

            log.info(
                    "Person ID : {}",
                    employee.getPersonId()
            );

            log.info(
                    "=========================================="
            );

        } else {

            log.info(
                    "Bootstrap Employee already exists. employeeCode={}",
                    employee.getEmployeeCode()
            );
        }

        // =================================================
        // 8. ENSURE ADMIN ROLE
        // =================================================

        boolean hasAdminRole =
                userRoleRepository
                        .findByUser_UserId(
                                user.getUserId()
                        )
                        .stream()
                        .anyMatch(
                                userRole ->
                                        userRole.getRole()
                                                .getRoleName()
                                                .equalsIgnoreCase(
                                                        "ADMIN"
                                                )
                        );

        if (!hasAdminRole) {

            UserRole userRole =
                    new UserRole();

            userRole.setUser(user);
            userRole.setRole(adminRole);

            userRoleRepository.save(userRole);

            log.info(
                    "ADMIN role assigned to admin user."
            );
        }

        // =================================================
        // FINAL MESSAGE
        // =================================================

        log.info("==========================================");
        log.info("SYSTEM ADMIN EMPLOYEE READY");
        log.info("==========================================");
        log.info("Admin Email : {}", adminEmail);
        log.info("Employee Code : SYSTEM-001");
        log.info("Role : ADMIN");
        log.info("==========================================");
    }
}