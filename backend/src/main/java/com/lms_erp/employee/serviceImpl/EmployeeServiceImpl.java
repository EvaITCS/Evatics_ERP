package com.lms_erp.employee.serviceImpl;

import com.lms_erp.common.util.NameFormatterUtil;
import com.lms_erp.common.util.PasswordGenerator;

import com.lms_erp.email.EmailService;

import com.lms_erp.employee.dto.*;
import com.lms_erp.employee.entity.*;
import com.lms_erp.employee.exception.EmployeeNotFoundException;
import com.lms_erp.employee.repository.*;
import com.lms_erp.employee.service.EmployeeService;

import com.lms_erp.person.dto.PersonAddressDto;
import com.lms_erp.person.dto.PersonContactDto;
import com.lms_erp.person.dto.PersonDocumentDto;
import com.lms_erp.person.dto.PersonEducationDto;
import com.lms_erp.person.dto.PersonEmergencyContactRequest;
import com.lms_erp.person.dto.PersonEmergencyContactResponse;
import com.lms_erp.person.dto.PersonVisaDto;
import com.lms_erp.person.dto.PersonWorkExperienceDto;

import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.*;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.user.entity.Role;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    // =====================================================
    // EMPLOYEE REPOSITORIES
    // =====================================================

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    private final EmployeeStatusRepository employeeStatusRepository;
    private final WorkModeRepository workModeRepository;
    private final ShiftRepository shiftRepository;
    private final LocationRepository locationRepository;
    private final CurrentUserService currentUserService;
    private final EmployeeStatusHistoryRepository employeeStatusHistoryRepository;
    private final EmployeeActivityLogRepository employeeActivityLogRepository;


    // =====================================================
    // PERSON REPOSITORIES
    // =====================================================

    private final PersonRepository personRepository;
    private final PersonContactRepository personContactRepository;
    private final PersonAddressRepository personAddressRepository;
    private final PersonEducationRepository personEducationRepository;
    private final PersonVisaRepository personVisaRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final PersonWorkExperienceRepository personWorkExperienceRepository;
    private final PersonEmergencyContactRepository personEmergencyContactRepository;


    // =====================================================
    // PERSON MASTER REPOSITORIES
    // =====================================================

    private final GenderMasterRepository genderMasterRepository;
    private final NationalityMasterRepository nationalityMasterRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;
    private final AddressTypeMasterRepository addressTypeMasterRepository;
    private final CountryMasterRepository countryMasterRepository;


    // =====================================================
    // USER REPOSITORIES
    // =====================================================

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;


    // =====================================================
    // SERVICES
    // =====================================================

    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // CREATE PERSON
    // =====================================================

    private Person createPerson(CreateEmployeeRequest request) {

//        GenderMaster gender =
//                genderMasterRepository.findById(request.getGenderId())
//                        .orElseThrow(() ->
//                                new RuntimeException("Gender not found"));

        GenderMaster gender = null;

        if (request.getGenderId() != null) {

            gender =
                    genderMasterRepository.findById(
                                    request.getGenderId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Gender not found: "
                                                    + request.getGenderId()
                                    )
                            );
        }


        NationalityMaster nationality =
                nationalityMasterRepository.findById(request.getNationalityId())
                        .orElseThrow(() ->
                                new RuntimeException("Nationality not found"));

        Person person = Person.builder()
                .firstName(
                        NameFormatterUtil.toTitleCase(
                                request.getFirstName()
                        )
                )
                .middleName(
                        NameFormatterUtil.toTitleCase(
                                request.getMiddleName()
                        )
                )
                .lastName(
                        NameFormatterUtil.toTitleCase(
                                request.getLastName()
                        )
                )
                .gender(gender)
                .nationality(nationality)
                .birthYear(request.getBirthYear())
                .build();

        return personRepository.save(person);
    }


    // =====================================================
    // SAVE CONTACTS
    // =====================================================

    private void saveContacts(
            Person person,
            List<PersonContactDto> contacts
    ) {

        if (contacts == null || contacts.isEmpty()) {
            return;
        }

        for (PersonContactDto dto : contacts) {

            if (dto == null) {
                continue;
            }

            if (dto.getContactTypeId() == null) {
                continue;
            }

            ContactTypeMaster contactType =
                    contactTypeMasterRepository
                            .findById(dto.getContactTypeId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Contact Type not found: "
                                                    + dto.getContactTypeId()
                                    )
                            );

            CountryMaster country = null;

            if (dto.getCountryId() != null) {

                country =
                        countryMasterRepository
                                .findById(dto.getCountryId())
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Country not found: "
                                                        + dto.getCountryId()
                                        )
                                );
            }

            PersonContact contact =
                    PersonContact.builder()
                            .person(person)
                            .contactType(contactType)
                            .country(country)
                            .contactValue(dto.getContactValue())
                            .isPrimary(
                                    Boolean.TRUE.equals(
                                            dto.getIsPrimary()
                                    )
                            )
                            .build();

            personContactRepository.save(contact);
        }
    }


    // =====================================================
// SAVE ADDRESSES
// =====================================================

    private void saveAddresses(
            Person person,
            List<PersonAddressDto> addresses
    ) {

        if (addresses == null || addresses.isEmpty()) {
            return;
        }

        for (PersonAddressDto dto : addresses) {

            if (dto == null) {
                continue;
            }

            // =================================================
            // VALIDATE ZIP CODE
            // =================================================

            String zipCode = dto.getZipCode();

            if (zipCode == null || zipCode.isBlank()) {

                throw new RuntimeException(
                        "Address Zip Code is required."
                );
            }

            zipCode = zipCode.trim();

            // =================================================
            // CREATE ADDRESS
            // =================================================

            PersonAddress address =
                    new PersonAddress();

            address.setPerson(person);

            // =================================================
            // ADDRESS TYPE
            // =================================================

            if (dto.getAddressTypeId() != null) {

                AddressTypeMaster addressType =
                        addressTypeMasterRepository
                                .findById(
                                        dto.getAddressTypeId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Address Type not found"
                                        )
                                );

                address.setAddressType(
                        addressType
                );
            }

            // =================================================
            // ADDRESS
            // =================================================

            address.setAddressLine1(
                    dto.getAddressLine1()
            );

            address.setAddressLine2(
                    dto.getAddressLine2()
            );

            // =================================================
            // LOCATION
            // =================================================

            address.setCity(
                    dto.getCity()
            );

            address.setState(
                    dto.getState()
            );

            address.setCountry(
                    dto.getCountry()
            );

            // =================================================
            // ZIP CODE
            // =================================================

            address.setZipcode(
                    zipCode
            );

            // =================================================
            // SAVE
            // =================================================

            personAddressRepository.save(
                    address
            );
        }
    }
    // =====================================================
    // SAVE EDUCATIONS
    // =====================================================

    private void saveEducations(
            Person person,
            List<PersonEducationDto> educations
    ) {

        if (educations == null || educations.isEmpty()) {
            return;
        }

        for (PersonEducationDto dto : educations) {

            if (dto == null ||
                    dto.getQualification() == null ||
                    dto.getQualification().isBlank()) {

                continue;
            }

            PersonEducation education =
                    new PersonEducation();

            education.setPerson(person);
            education.setQualification(
                    dto.getQualification()
            );
            education.setInstituteName(
                    dto.getInstituteName()
            );
            education.setFieldOfStudy(
                    dto.getFieldOfStudy()
            );
            education.setPassingYear(
                    dto.getPassingYear()
            );

            personEducationRepository.save(
                    education
            );
        }
    }


    // =====================================================
    // SAVE EMERGENCY CONTACTS
    // =====================================================

    private void saveEmergencyContacts(
            Person person,
            List<PersonEmergencyContactRequest> emergencyContacts
    ) {

        if (emergencyContacts == null ||
                emergencyContacts.isEmpty()) {

            return;
        }

        for (PersonEmergencyContactRequest dto :
                emergencyContacts) {

            if (dto == null) {
                continue;
            }

            if (dto.getContactName() == null ||
                    dto.getContactName().isBlank()) {

                continue;
            }

            if (dto.getRelationship() == null ||
                    dto.getRelationship().isBlank()) {

                continue;
            }

            if (dto.getPhoneNumber() == null ||
                    dto.getPhoneNumber().isBlank()) {

                continue;
            }

            PersonEmergencyContact emergencyContact =
                    PersonEmergencyContact.builder()
                            .person(person)
                            .contactName(
                                    dto.getContactName()
                            )
                            .relationship(
                                    dto.getRelationship()
                            )
                            .phoneNumber(
                                    dto.getPhoneNumber()
                            )
                            .addressLine1(
                                    dto.getAddressLine1()
                            )
                            .addressLine2(
                                    dto.getAddressLine2()
                            )
                            .city(
                                    dto.getCity()
                            )
                            .state(
                                    dto.getState()
                            )
                            .country(
                                    dto.getCountry()
                            )
                            .zipcode(
                                    dto.getZipcode()
                            )
                            .build();

            personEmergencyContactRepository.save(
                    emergencyContact
            );
        }
    }


    // =====================================================
    // SAVE VISAS
    // =====================================================

    private void saveVisas(
            Person person,
            List<PersonVisaDto> visas
    ) {

        if (visas == null || visas.isEmpty()) {
            return;
        }

        for (PersonVisaDto dto : visas) {

            if (dto == null) {
                continue;
            }

            PersonVisa visa =
                    PersonVisa.builder()
                            .person(person)

                            .visaType(
                                    dto.getVisaType()
                            )

                            .eadType(
                                    "EAD".equalsIgnoreCase(
                                            dto.getVisaType()
                                    )
                                            ? dto.getEadType()
                                            : null
                            )

                            .visaExpiryDate(
                                    "US Citizen".equalsIgnoreCase(
                                            dto.getVisaType()
                                    )
                                            ||
                                            "Green Card".equalsIgnoreCase(
                                                    dto.getVisaType()
                                            )
                                            ? null
                                            : dto.getVisaExpiryDate()
                            )

                            .build();

            personVisaRepository.save(visa);
        }
    }


    // =====================================================
    // SAVE DOCUMENTS
    // =====================================================

    private void saveDocuments(
            Person person,
            List<PersonDocumentDto> documents,
            List<MultipartFile> files
    ) {

        if (documents == null || documents.isEmpty()) {
            return;
        }

        for (int i = 0; i < documents.size(); i++) {

            PersonDocumentDto dto = documents.get(i);

            if (dto == null ||
                    dto.getDocumentType() == null ||
                    dto.getDocumentType().isBlank()) {
                continue;
            }

            PersonDocument document = new PersonDocument();

            document.setPerson(person);

            document.setDocumentType(
                    dto.getDocumentType()
            );

            document.setDocumentNumber(
                    dto.getDocumentNumber()
            );

            // ============================================
            // FILE
            // ============================================

            if (files != null && i < files.size()) {

                MultipartFile file = files.get(i);

                if (file != null && !file.isEmpty()) {

                    try {

                        document.setFileName(
                                file.getOriginalFilename()
                        );

                        document.setFileData(
                                file.getBytes()
                        );

                        document.setContentType(
                                file.getContentType()
                        );

                        document.setFileSize(
                                file.getSize()
                        );

                    } catch (IOException e) {

                        throw new RuntimeException(
                                "Failed to read document file",
                                e
                        );
                    }
                }
            }

            personDocumentRepository.save(document);
        }
    }


    // =====================================================
    // SAVE WORK EXPERIENCES
    // =====================================================

    private void saveWorkExperiences(
            Person person,
            List<PersonWorkExperienceDto> workExperiences
    ) {

        if (workExperiences == null ||
                workExperiences.isEmpty()) {

            return;
        }

        for (PersonWorkExperienceDto dto :
                workExperiences) {

            if (dto == null ||
                    dto.getCompanyName() == null ||
                    dto.getCompanyName().isBlank()) {

                continue;
            }

            PersonWorkExperience experience =
                    new PersonWorkExperience();

            experience.setPerson(person);

            experience.setCompanyName(
                    dto.getCompanyName()
            );

            experience.setDesignation(
                    dto.getDesignation()
            );

            experience.setStartDate(
                    dto.getStartDate()
            );

            experience.setEndDate(
                    dto.getEndDate()
            );

            experience.setCurrentlyWorking(
                    dto.getCurrentlyWorking()
            );

            experience.setSkillsUsed(
                    dto.getSkillsUsed()
            );

            experience.setJobDescription(
                    dto.getJobDescription()
            );

            personWorkExperienceRepository.save(
                    experience
            );
        }
    }
    // =====================================================
    // CREATE EMPLOYEE ENTITY
    // =====================================================

    private Employee createEmployeeEntity(
            Person person,
            CreateEmployeeRequest request
    ) {

        Department department =
                request.getDepartmentId() != null
                        ? departmentRepository
                        .findById(request.getDepartmentId())
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Department not found"
                                     )
                        )
                        : null;


        Designation designation =
                request.getDesignationId() != null
                        ? designationRepository
                        .findById(request.getDesignationId())
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Designation not found"
                                     )
                        )
                        : null;


        EmployeeStatusMaster employeeStatus =
                request.getEmployeeStatusId() != null
                        ? employeeStatusRepository
                        .findById(
                                request.getEmployeeStatusId()
                        )
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Employee Status not found"
                                     )
                        )
                        : null;


        WorkMode workMode =
                request.getWorkModeId() != null
                        ? workModeRepository
                        .findById(request.getWorkModeId())
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Work Mode not found"
                                     )
                        )
                        : null;


        Shift shift =
                request.getShiftId() != null
                        ? shiftRepository
                        .findById(request.getShiftId())
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Shift not found"
                                     )
                        )
                        : null;


        Location location =
                request.getLocationId() != null
                        ? locationRepository
                        .findById(request.getLocationId())
                        .orElseThrow(() ->
                                     new RuntimeException(
                                             "Location not found"
                                     )
                        )
                        : null;


        String nationality =
                person.getNationality() != null
                        ? person.getNationality()
                        .getNationalityName()
                        : null;


        Employee employee =
                Employee.builder()
                        .person(person)

                        .employeeCode(
                                generateEmployeeCode(
                                        nationality
                                )
                        )

                        .joiningDate(
                                request.getJoiningDate() != null
                                        ? request.getJoiningDate()
                                        : LocalDate.now()
                        )

                        .department(department)

                        .designation(designation)

                        .employmentType(
                                request.getEmploymentType()
                        )

                        .employeeStatus(
                                employeeStatus
                        )

                        .workMode(workMode)

                        .shift(shift)

                        .location(location)

                        .probationEndDate(
                                request.getProbationEndDate()
                        )

                        .isMarried(
                                Boolean.TRUE.equals(
                                        request.getIsMarried()
                                )
                        )

                        .build();


        return employeeRepository.save(employee);
    }


    // =====================================================
    // CREATE USER
    // =====================================================

    private User createUser(
            Person person,
            Employee employee,
            String temporaryPassword
    ) {

        String primaryEmail =
                getPrimaryEmail(person);


        String username =
                primaryEmail != null &&
                        !primaryEmail.isBlank()

                        ? primaryEmail.trim()

                        : employee.getEmployeeCode();


        User user = new User();

        user.setPerson(person);

        user.setUsername(username);

        // IMPORTANT:
        // Store encoded password only
        user.setPassword(
                passwordEncoder.encode(
                        temporaryPassword
                )
        );

        user.setIsActive(true);

        user.setIsLocked(false);

        user.setFailedAttempts(0);

        // First login must change password
        user.setMustChangePassword(true);

        user.setPasswordChangedAt(null);


        return userRepository.save(user);
    }


    // =====================================================
    // PRIMARY EMAIL
    // =====================================================

    private String getPrimaryEmail(Person person) {

        List<PersonContact> contacts =
                personContactRepository
                        .findByPerson(person);


        return contacts.stream()

                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        )
                )

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        "PRIMARY_EMAIL"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(PersonContact::getContactValue)

                .filter(Objects::nonNull)

                .map(String::trim)

                .filter(email ->
                        !email.isBlank()
                )

                .findFirst()

                .orElse(null);
    }


    // =====================================================
    // PRIMARY PHONE
    // =====================================================

    private String getPrimaryPhone(Person person) {

        return personContactRepository
                .findByPerson(person)

                .stream()

                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        )
                )

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        "PRIMARY_PHONE"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(PersonContact::getContactValue)

                .filter(Objects::nonNull)

                .map(String::trim)

                .filter(phone ->
                        !phone.isBlank()
                )

                .findFirst()

                .orElse(null);
    }


    // =====================================================
    // ASSIGN ROLE
    // =====================================================

    private Role assignRole(
            User user,
            Employee employee
    ) {

        Designation designation =
                employee.getDesignation();


        if (designation == null) {
            throw new RuntimeException(
                    "Designation not assigned."
            );
        }


        Role role =
                designation.getRole();


        if (role == null) {
            throw new RuntimeException(
                    "Role not configured for designation."
            );
        }


        if (!userRoleRepository
                .existsByUserAndRole(user, role)) {

            UserRole userRole =
                    new UserRole();

            userRole.setUser(user);

            userRole.setRole(role);

            userRoleRepository.save(
                    userRole
            );
        }


        return role;
    }
    // =====================================================
    // BUILD EMPLOYEE RESPONSE
    // =====================================================

    private EmployeeResponse buildEmployeeResponse(
            Employee employee
    ) {

        Person person =
                employee.getPerson();


        User user =
                userRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
                        .orElse(null);


        Role role = null;


        if (user != null) {

            List<UserRole> userRoles =
                    userRoleRepository
                            .findByUser_UserId(
                                    user.getUserId()
                            );


            if (!userRoles.isEmpty()) {

                role =
                        userRoles
                                .get(0)
                                .getRole();
            }
        }


        return EmployeeResponse.builder()

                // =====================================
                // EMPLOYEE
                // =====================================

                .personId(
                        employee.getPersonId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )


                // =====================================
                // PERSON
                // =====================================

                .fullName(
                        Stream.of(
                                        person.getFirstName(),
                                        person.getMiddleName(),
                                        person.getLastName()
                                )
                                .filter(Objects::nonNull)
                                .filter(name ->
                                        !name.isBlank()
                                )
                                .collect(
                                        Collectors.joining(" ")
                                )
                )


                // =====================================
                // CONTACT
                // =====================================

                .primaryEmail(
                        getPrimaryEmail(person)
                )

                .primaryPhone(
                        getPrimaryPhone(person)
                )


                // =====================================
                // PROFESSIONAL
                // =====================================

                .departmentName(
                        employee.getDepartment() != null
                                ? employee.getDepartment()
                                .getDepartmentName()
                                : null
                )

                .designationName(
                        employee.getDesignation() != null
                                ? employee.getDesignation()
                                .getDesignationName()
                                : null
                )

                .employmentType(
                        employee.getEmploymentType()
                )

                .employeeStatus(
                        employee.getEmployeeStatus() != null
                                ? employee.getEmployeeStatus()
                                .getStatusName()
                                : null
                )

                .workMode(
                        employee.getWorkMode() != null
                                ? employee.getWorkMode()
                                .getModeName()
                                : null
                )

                .shiftName(
                        employee.getShift() != null
                                ? employee.getShift()
                                .getShiftName()
                                : null
                )

                .locationName(
                        employee.getLocation() != null
                                ? employee.getLocation()
                                .getLocationName()
                                : null
                )


                // =====================================
                // DATES
                // =====================================

                .joiningDate(
                        employee.getJoiningDate()
                )

                .probationEndDate(
                        employee.getProbationEndDate()
                )


                // =====================================
                // AUDIT
                // =====================================

                .createdAt(
                        employee.getCreatedAt()
                )


                // =====================================
                // USER
                // =====================================

                .userId(
                        user != null
                                ? user.getUserId()
                                : null
                )

                .generatedUsername(
                        user != null
                                ? user.getUsername()
                                : null
                )

                .assignedRole(
                        role != null
                                ? role.getRoleName()
                                : null
                )

                .build();
    }


    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================
    @Override
    @Transactional
    public EmployeeResponse createEmployee(
            CreateEmployeeRequest request,
            List<MultipartFile> documents
    ) {

        // =====================================
        // CHECK EMAIL DUPLICATION
        // =====================================

        if (request.getContacts() != null) {

            for (PersonContactDto contact : request.getContacts()) {

                if (contact == null ||
                        contact.getContactValue() == null ||
                        contact.getContactValue().isBlank()) {
                    continue;
                }

                ContactTypeMaster contactType =
                        contactTypeMasterRepository
                                .findById(contact.getContactTypeId())
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Contact Type not found"
                                        )
                                );

                String contactTypeName =
                        contactType.getContactTypeName();

                if ("PRIMARY_EMAIL".equalsIgnoreCase(contactTypeName)
                        || "ALTERNATE_EMAIL".equalsIgnoreCase(contactTypeName)) {

                    boolean emailExists =
                            personContactRepository
                                    .existsEmailForAnotherPerson(
                                            contact.getContactValue().trim(),
                                            null
                                    );

                    if (emailExists) {
                        throw new RuntimeException(
                                "This email address is already registered in the system."
                        );
                    }
                }
            }
        }

        // =====================================
        // CREATE PERSON
        // =====================================

        Person person = createPerson(request);

        // =====================================
        // PERSON SUB MODULES
        // =====================================

        saveContacts(
                person,
                request.getContacts()
        );

        saveAddresses(
                person,
                request.getAddresses()
        );

        saveEducations(
                person,
                request.getEducations()
        );

        saveVisas(
                person,
                request.getVisas()
        );

        // =====================================
        // SAVE DOCUMENTS IN DATABASE
        // =====================================

        saveDocuments(
                person,
                request.getDocuments(),
                documents
        );

        saveWorkExperiences(
                person,
                request.getWorkExperiences()
        );

        saveEmergencyContacts(
                person,
                request.getEmergencyContacts()
        );

        // =====================================
        // CREATE EMPLOYEE
        // =====================================

        Employee employee =
                createEmployeeEntity(
                        person,
                        request
                );

        // =====================================
        // GENERATE TEMPORARY PASSWORD
        // =====================================

        String temporaryPassword =
                PasswordGenerator.generatePassword(12);

        // =====================================
        // CREATE USER
        // =====================================

        User user =
                createUser(
                        person,
                        employee,
                        temporaryPassword
                );

        // =====================================
        // ASSIGN ROLE
        // =====================================

        assignRole(
                user,
                employee
        );

        // =====================================
        // ACTIVITY LOG
        // =====================================

        EmployeeActivityLog activityLog =
                EmployeeActivityLog.builder()
                        .employee(employee)
                        .activityType("CREATE")
                        .activityDescription(
                                "Employee created"
                        )
                        .createdBy(employee)
                        .build();

        employeeActivityLogRepository.save(
                activityLog
        );

        // =====================================
        // SEND LOGIN CREDENTIALS
        // =====================================

        String primaryEmail =
                getPrimaryEmail(person);

        if (primaryEmail != null &&
                !primaryEmail.isBlank()) {

            emailService.sendCredentialsEmail(
                    primaryEmail,
                    user.getUsername(),
                    temporaryPassword
            );
        }

        // =====================================
        // RESPONSE
        // =====================================

        return buildEmployeeResponse(
                employee
        );
    }
    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(
            Long personId,
            UpdateEmployeeRequest request,
            List<MultipartFile> documents
    ) {

        Employee employee =
                employeeRepository.findById(personId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Employee not found"
                                )
                        );


        Person person =
                employee.getPerson();


        // =================================================
        // PERSON UPDATE
        // =================================================
        if (request.getGenderId() != null) {

            person.setGender(
                    genderMasterRepository
                            .findById(
                                    request.getGenderId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Gender not found"
                                    )
                            )
            );
        }


        if (request.getNationalityId() != null) {

            person.setNationality(
                    nationalityMasterRepository
                            .findById(
                                    request.getNationalityId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Nationality not found"
                                    )
                            )
            );
        }


        person.setBirthYear(
                request.getBirthYear()
        );


        personRepository.save(person);


        // =================================================
// CONTACTS
// =================================================
// Primary Email and Primary Phone are locked.
// Only Alternate Email / Alternate Phone can change.

        updateEmployeeContacts(
                person,
                request.getContacts()
        );


        // =================================================
        // ADDRESSES
        // =================================================

        personAddressRepository.deleteAll(
                personAddressRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
        );

        saveAddresses(
                person,
                request.getAddresses()
        );


        // =================================================
        // EDUCATIONS
        // =================================================

        personEducationRepository.deleteAll(
                personEducationRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
        );

        saveEducations(
                person,
                request.getEducations()
        );


        // =================================================
        // VISAS
        // =================================================

        personVisaRepository.deleteAll(
                personVisaRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
        );

        saveVisas(
                person,
                request.getVisas()
        );


        // =================================================
        // DOCUMENTS
        // =================================================

        updateDocuments(
                person,
                request.getDocuments(),
                documents
        );

        // =================================================
        // WORK EXPERIENCE
        // =================================================

        personWorkExperienceRepository.deleteAll(
                personWorkExperienceRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
        );

        saveWorkExperiences(
                person,
                request.getWorkExperiences()
        );


        // =================================================
        // EMERGENCY CONTACTS
        // =================================================

        personEmergencyContactRepository.deleteAll(
                personEmergencyContactRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
        );

        saveEmergencyContacts(
                person,
                request.getEmergencyContacts()
        );


        // =================================================
        // EMPLOYEE DETAILS
        // =================================================

        employee.setProbationEndDate(
                request.getProbationEndDate()
        );


        if (request.getIsMarried() != null) {

            employee.setIsMarried(
                    request.getIsMarried()
            );
        }


        if (request.getDepartmentId() != null) {

            employee.setDepartment(
                    departmentRepository
                            .findById(
                                    request.getDepartmentId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Department not found"
                                    )
                            )
            );
        }


        Designation designation =
                employee.getDesignation();


        if (request.getDesignationId() != null) {

            designation =
                    designationRepository
                            .findById(
                                    request.getDesignationId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Designation not found"
                                    )
                            );

            employee.setDesignation(
                    designation
            );
        }


        if (request.getEmploymentType() != null) {

            employee.setEmploymentType(
                    request.getEmploymentType()
            );
        }


        // =================================================
        // STATUS
        // =================================================

        EmployeeStatusMaster oldStatus =
                employee.getEmployeeStatus();


        if (request.getEmployeeStatusId() != null) {

            employee.setEmployeeStatus(
                    employeeStatusRepository
                            .findById(
                                    request.getEmployeeStatusId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Employee Status not found"
                                    )
                            )
            );
        }


        // =================================================
        // WORK MODE
        // =================================================

        if (request.getWorkModeId() != null) {

            employee.setWorkMode(
                    workModeRepository
                            .findById(
                                    request.getWorkModeId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Work Mode not found"
                                    )
                            )
            );
        }


        // =================================================
        // SHIFT
        // =================================================

        if (request.getShiftId() != null) {

            employee.setShift(
                    shiftRepository
                            .findById(
                                    request.getShiftId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Shift not found"
                                    )
                            )
            );
        }


        // =================================================
        // LOCATION
        // =================================================

        if (request.getLocationId() != null) {

            employee.setLocation(
                    locationRepository
                            .findById(
                                    request.getLocationId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Location not found"
                                    )
                            )
            );
        }


        Employee updatedEmployee =
                employeeRepository.save(
                        employee
                );
        // =================================================
        // UPDATE USER ROLE
        // =================================================

        User user =
                userRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        if (designation != null &&
                designation.getRole() != null) {

            Role newRole =
                    designation.getRole();


            List<UserRole> roles =
                    userRoleRepository
                            .findByUser_UserId(
                                    user.getUserId()
                            );


            if (roles.isEmpty()) {

                UserRole userRole =
                        new UserRole();

                userRole.setUser(user);
                userRole.setRole(newRole);

                userRoleRepository.save(
                        userRole
                );

            } else {

                UserRole userRole =
                        roles.get(0);

                userRole.setRole(
                        newRole
                );

                userRoleRepository.save(
                        userRole
                );
            }
        }


        // =================================================
        // UPDATE USERNAME
        // =================================================

        String email =
                getPrimaryEmail(person);


        if (email != null &&
                !email.isBlank()) {

            user.setUsername(
                    email.trim()
            );

            userRepository.save(user);
        }

        User currentUser =
                currentUserService.getCurrentUser();

        Employee changedBy =
                employeeRepository
                        .findByPersonPersonId(
                                currentUser
                                        .getPerson()
                                        .getPersonId()
                        )
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Authenticated user is not an employee"
                                )
                        );

        EmployeeActivityLog activityLog =
                EmployeeActivityLog.builder()
                        .employee(updatedEmployee)
                        .activityType("UPDATE")
                        .activityDescription(
                                "Employee details updated"
                        )
                        .createdBy(changedBy)
                        .build();


        employeeActivityLogRepository.save(
                activityLog
        );


        // =================================================
        // STATUS HISTORY
        // =================================================

        if (request.getEmployeeStatusId() != null &&
                (
                        oldStatus == null
                                ||
                                !oldStatus
                                        .getEmployeeStatusId()
                                        .equals(
                                                updatedEmployee
                                                        .getEmployeeStatus()
                                                        .getEmployeeStatusId()
                                        )
                )
        ) {

            EmployeeStatusHistory history =
                    EmployeeStatusHistory.builder()
                            .employee(
                                    updatedEmployee
                            )
                            .oldStatus(
                                    oldStatus
                            )
                            .newStatus(
                                    updatedEmployee
                                            .getEmployeeStatus()
                            )
                            .changedBy(
                                    changedBy
                            )
                            .remarks(
                                    "Employee status updated"
                            )
                            .build();


            employeeStatusHistoryRepository.save(
                    history
            );
        }


        return buildEmployeeResponse(
                updatedEmployee
        );
    }


    // =====================================================
    // GET EMPLOYEE BY ID
    // =====================================================

    @Override
    public EmployeeProfileResponse getEmployeeById(
            Long personId
    ) {

        Employee employee =
                employeeRepository.findById(personId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Employee not found"
                                )
                        );


        Person person =
                employee.getPerson();


        return EmployeeProfileResponse.builder()

                // =====================================
                // EMPLOYEE
                // =====================================

                .personId(
                        employee.getPersonId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )

                .joiningDate(
                        employee.getJoiningDate()
                )

                .probationEndDate(
                        employee.getProbationEndDate()
                )

                .employmentType(
                        employee.getEmploymentType()
                )

                .isMarried(
                        employee.getIsMarried()
                )


                // =====================================
                // PERSON
                // =====================================

                .fullName(
                        person != null
                                ? Stream.of(
                                        person.getFirstName(),
                                        person.getMiddleName(),
                                        person.getLastName()
                                )
                                .filter(Objects::nonNull)
                                .filter(name ->
                                        !name.isBlank()
                                )
                                .collect(
                                        Collectors.joining(" ")
                                )
                                : null
                )

                .firstName(
                        person != null
                                ? person.getFirstName()
                                : null
                )

                .middleName(
                        person != null
                                ? person.getMiddleName()
                                : null
                )

                .lastName(
                        person != null
                                ? person.getLastName()
                                : null
                )




// =====================================================
// GENDER
// =====================================================

                .genderId(
                        person != null &&
                                person.getGender() != null
                                ? person.getGender().getGenderId()
                                : null
                )

                .gender(
                        person != null &&
                                person.getGender() != null
                                ? person.getGender().getGenderName()
                                : null
                )


// =====================================================
// BIRTH YEAR
// =====================================================

                .birthYear(
                        person != null
                                ? person.getBirthYear()
                                : null
                )


// =====================================================
// NATIONALITY
// =====================================================

                .nationalityId(
                        person != null &&
                                person.getNationality() != null
                                ? person.getNationality().getNationalityId()
                                : null
                )

                .nationality(
                        person != null &&
                                person.getNationality() != null
                                ? person.getNationality().getNationalityName()
                                : null
                )



                // =====================================
                // CONTACT
                // =====================================

                .email(
                        person != null
                                ? getPrimaryEmail(person)
                                : null
                )

                .phone(
                        person != null
                                ? getPrimaryPhone(person)
                                : null
                )

                .contacts(
                        mapContacts(person)
                )


                // =====================================
                // PROFESSIONAL
                // =====================================

                .departmentId(
                        employee.getDepartment() != null
                                ? employee.getDepartment()
                                .getDepartmentId()
                                : null
                )

                .departmentName(
                        employee.getDepartment() != null
                                ? employee.getDepartment()
                                .getDepartmentName()
                                : null
                )

                .designationId(
                        employee.getDesignation() != null
                                ? employee.getDesignation()
                                .getDesignationId()
                                : null
                )

                .designationName(
                        employee.getDesignation() != null
                                ? employee.getDesignation()
                                .getDesignationName()
                                : null
                )

                .employeeStatusId(
                        employee.getEmployeeStatus() != null
                                ? employee.getEmployeeStatus()
                                .getEmployeeStatusId()
                                : null
                )

                .employeeStatus(
                        employee.getEmployeeStatus() != null
                                ? employee.getEmployeeStatus()
                                .getStatusName()
                                : null
                )

                .workModeId(
                        employee.getWorkMode() != null
                                ? employee.getWorkMode()
                                .getModeId()
                                : null
                )

                .workMode(
                        employee.getWorkMode() != null
                                ? employee.getWorkMode()
                                .getModeName()
                                : null
                )

                .shiftId(
                        employee.getShift() != null
                                ? employee.getShift()
                                .getShiftId()
                                : null
                )

                .shiftName(
                        employee.getShift() != null
                                ? employee.getShift()
                                .getShiftName()
                                : null
                )

                .locationId(
                        employee.getLocation() != null
                                ? employee.getLocation()
                                .getLocationId()
                                : null
                )

                .locationName(
                        employee.getLocation() != null
                                ? employee.getLocation()
                                .getLocationName()
                                : null
                )


                // =====================================
                // AUDIT
                // =====================================

                .createdAt(
                        employee.getCreatedAt()
                )


                // =====================================
                // SUB MODULES
                // =====================================

                .addresses(
                        mapAddresses(person)
                )

                .contacts(
                        mapContacts(person)
                )

                .educations(
                        mapEducations(person)
                )

                .visas(
                        mapVisas(person)
                )

                .documents(
                        mapDocuments(person)
                )

                .workExperiences(
                        mapWorkExperiences(person)
                )

                .emergencyContacts(
                        mapEmergencyContacts(person)
                )

                .build();
    }
    // =====================================================
    // GET ALL EMPLOYEES
    // =====================================================

    @Override
    public List<EmployeeResponse> getAllEmployees() {

        List<Employee> employees =
                employeeRepository
                        .findAllWithDetails();


        List<User> users =
                userRepository
                        .findAllWithPerson();


        Map<Long, User> userMap =
                users.stream()

                        .filter(user ->
                                user.getPerson() != null
                        )

                        .collect(
                                Collectors.toMap(
                                        user ->
                                                user.getPerson()
                                                        .getPersonId(),

                                        user -> user
                                )
                        );


        List<EmployeeResponse> responseList =
                new ArrayList<>();


        for (Employee employee :
                employees) {

            Person person =
                    employee.getPerson();


            User user =
                    person != null
                            ? userMap.get(
                            person.getPersonId()
                    )
                            : null;


            EmployeeResponse response =
                    EmployeeResponse.builder()

                            .personId(
                                    employee.getPersonId()
                            )

                            .employeeCode(
                                    employee.getEmployeeCode()
                            )

                            .fullName(
                                    person != null
                                            ? Stream.of(
                                                    person.getFirstName(),
                                                    person.getMiddleName(),
                                                    person.getLastName()
                                            )
                                            .filter(
                                                    Objects::nonNull
                                            )
                                            .filter(
                                                    name ->
                                                    !name.isBlank()
                                            )
                                            .collect(
                                                    Collectors.joining(" ")
                                            )
                                            : null
                            )

                            .primaryEmail(
                                    person != null
                                            ? getPrimaryEmail(
                                            person
                                    )
                                            : null
                            )

                            .alternateEmail(
                                    person != null
                                            ? getAlternateEmail(
                                            person
                                    )
                                            : null
                            )

                            .primaryPhone(
                                    person != null
                                            ? getPrimaryPhone(
                                            person
                                    )
                                            : null
                            )

                            .alternatePhone(
                                    person != null
                                            ? getAlternatePhone(
                                            person
                                    )
                                            : null
                            )

                            .departmentName(
                                    employee.getDepartment() != null
                                            ? employee.getDepartment()
                                            .getDepartmentName()
                                            : null
                            )

                            .designationName(
                                    employee.getDesignation() != null
                                            ? employee.getDesignation()
                                            .getDesignationName()
                                            : null
                            )

                            .employmentType(
                                    employee.getEmploymentType()
                            )

                            .employeeStatus(
                                    employee.getEmployeeStatus() != null
                                            ? employee.getEmployeeStatus()
                                            .getStatusName()
                                            : null
                            )

                            .workMode(
                                    employee.getWorkMode() != null
                                            ? employee.getWorkMode()
                                            .getModeName()
                                            : null
                            )

                            .shiftName(
                                    employee.getShift() != null
                                            ? employee.getShift()
                                            .getShiftName()
                                            : null
                            )

                            .locationName(
                                    employee.getLocation() != null
                                            ? employee.getLocation()
                                            .getLocationName()
                                            : null
                            )

                            .joiningDate(
                                    employee.getJoiningDate()
                            )

                            .probationEndDate(
                                    employee.getProbationEndDate()
                            )

                            .createdAt(
                                    employee.getCreatedAt()
                            )

                            .userId(
                                    user != null
                                            ? user.getUserId()
                                            : null
                            )

                            .build();


            responseList.add(response);
        }


        return responseList;
    }


    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    @Override
    @Transactional
    public void deleteEmployee(
            Long personId
    ) {

        Employee employee =
                employeeRepository.findById(
                                personId
                        )
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Employee not found"
                                )
                        );


        Person person =
                employee.getPerson();


        // Delete user first
        if (person != null) {

            userRepository
                    .findByPersonPersonId(
                            person.getPersonId()
                    )
                    .ifPresent(
                            userRepository::delete
                    );
        }


        // Delete employee
        employeeRepository.delete(
                employee
        );


        // Delete person
        if (person != null) {

            personRepository.delete(
                    person
            );
        }
    }


    // =====================================================
    // MAP ADDRESSES
    // =====================================================

    private List<PersonAddressDto> mapAddresses(
            Person person
    ) {

        if (person == null ||
                person.getAddresses() == null) {

            return List.of();
        }


        return person.getAddresses()

                .stream()

                .map(address -> {

                    PersonAddressDto dto =
                            new PersonAddressDto();


                    dto.setAddressId(
                            address.getAddressId()
                    );


                    if (address.getAddressType() != null) {

                        dto.setAddressTypeId(
                                address.getAddressType()
                                        .getAddressTypeId()
                        );

                        dto.setAddressTypeName(
                                address.getAddressType()
                                        .getAddressTypeName()
                        );
                    }


                    dto.setAddressLine1(
                            address.getAddressLine1()
                    );

                    dto.setAddressLine2(
                            address.getAddressLine2()
                    );

                    dto.setCity(
                            address.getCity()
                    );

                    dto.setState(
                            address.getState()
                    );

                    dto.setCountry(
                            address.getCountry()
                    );

                    dto.setZipCode(
                            address.getZipcode()
                    );


                    return dto;

                })

                .toList();
    }


    // =====================================================
    // MAP EDUCATIONS
    // =====================================================

    private List<PersonEducationDto> mapEducations(
            Person person
    ) {

        if (person == null ||
                person.getEducations() == null) {

            return List.of();
        }


        return person.getEducations()

                .stream()

                .map(education -> {

                    PersonEducationDto dto =
                            new PersonEducationDto();

                    dto.setPersonEducationId(
                            education.getPersonEducationId()
                    );

                    dto.setQualification(
                            education.getQualification()
                    );

                    dto.setInstituteName(
                            education.getInstituteName()
                    );

                    dto.setFieldOfStudy(
                            education.getFieldOfStudy()
                    );

                    dto.setPassingYear(
                            education.getPassingYear()
                    );

                    return dto;

                })

                .toList();
    }


    // =====================================================
    // MAP VISAS
    // =====================================================

    private List<PersonVisaDto> mapVisas(
            Person person
    ) {

        if (person == null ||
                person.getVisas() == null) {

            return List.of();
        }


        return person.getVisas()

                .stream()

                .map(visa -> {

                    PersonVisaDto dto =
                            new PersonVisaDto();

                    dto.setPersonVisaId(
                            visa.getPersonVisaId()
                    );

                    dto.setVisaType(
                            visa.getVisaType()
                    );

                    dto.setEadType(
                            visa.getEadType()
                    );

                    dto.setVisaExpiryDate(
                            visa.getVisaExpiryDate()
                    );

                    return dto;

                })

                .toList();
    }


    // =====================================================
    // MAP DOCUMENTS
    // =====================================================

    private List<PersonDocumentDto> mapDocuments(
            Person person
    ) {

        if (person == null ||
                person.getDocuments() == null) {

            return List.of();
        }

        return person.getDocuments()
                .stream()
                .map(document -> {

                    PersonDocumentDto dto =
                            new PersonDocumentDto();

                    dto.setPersonDocumentId(
                            document.getPersonDocumentId()
                    );

                    dto.setDocumentType(
                            document.getDocumentType()
                    );

                    dto.setDocumentNumber(
                            document.getDocumentNumber()
                    );

                    dto.setFileName(
                            document.getFileName()
                    );

                    dto.setContentType(
                            document.getContentType()
                    );

                    dto.setFileSize(
                            document.getFileSize()
                    );

                    return dto;

                })
                .toList();
    }

    // =====================================================
    // MAP WORK EXPERIENCES
    // =====================================================

    private List<PersonWorkExperienceDto>
    mapWorkExperiences(
            Person person
    ) {

        if (person == null ||
                person.getWorkExperiences() == null) {

            return List.of();
        }


        return person.getWorkExperiences()

                .stream()

                .map(exp -> {

                    PersonWorkExperienceDto dto =
                            new PersonWorkExperienceDto();

                    dto.setExperienceId(
                            exp.getExperienceId()
                    );

                    dto.setCompanyName(
                            exp.getCompanyName()
                    );

                    dto.setDesignation(
                            exp.getDesignation()
                    );

                    dto.setStartDate(
                            exp.getStartDate()
                    );

                    dto.setEndDate(
                            exp.getEndDate()
                    );

                    dto.setCurrentlyWorking(
                            exp.getCurrentlyWorking()
                    );

                    dto.setSkillsUsed(
                            exp.getSkillsUsed()
                    );

                    dto.setJobDescription(
                            exp.getJobDescription()
                    );

                    return dto;

                })

                .toList();
    }


    // =====================================================
    // MAP EMERGENCY CONTACTS
    // =====================================================

    private List<PersonEmergencyContactResponse>
    mapEmergencyContacts(
            Person person
    ) {

        if (person == null ||
                person.getEmergencyContacts() == null) {

            return List.of();
        }


        return person.getEmergencyContacts()

                .stream()

                .map(contact -> {

                    PersonEmergencyContactResponse response =
                            new PersonEmergencyContactResponse();


                    response.setEmergencyContactId(
                            contact.getEmergencyContactId()
                    );

                    response.setContactName(
                            contact.getContactName()
                    );

                    response.setRelationship(
                            contact.getRelationship()
                    );

                    response.setPhoneNumber(
                            contact.getPhoneNumber()
                    );

                    response.setAddressLine1(
                            contact.getAddressLine1()
                    );

                    response.setAddressLine2(
                            contact.getAddressLine2()
                    );

                    response.setCity(
                            contact.getCity()
                    );

                    response.setState(
                            contact.getState()
                    );

                    response.setCountry(
                            contact.getCountry()
                    );

                    response.setZipcode(
                            contact.getZipcode()
                    );


                    return response;

                })

                .toList();
    }


    // =====================================================
    // GENERATE ALPHABET
    // =====================================================

    private String generateAlphabet(
            long number
    ) {

        StringBuilder result =
                new StringBuilder();


        while (number > 0) {

            number--;

            result.insert(
                    0,
                    (char) (
                            'A' +
                                    (number % 26)
                    )
            );

            number =
                    number / 26;
        }


        return result.toString();
    }


    // =====================================================
    // COUNTRY CODE
    // =====================================================

    private String getCountryCode(
            String nationality
    ) {

        if (nationality == null ||
                nationality.isBlank()) {

            return "INT";
        }


        String cleaned =
                nationality
                        .replaceAll(
                                "[^A-Za-z]",
                                ""
                        )
                        .toUpperCase();


        if (cleaned.length() >= 3) {

            return cleaned.substring(
                    0,
                    3
            );
        }


        return cleaned;
    }


// =====================================================
// GENERATE EMPLOYEE CODE
// =====================================================

    private String generateEmployeeCode(String nationality) {

        String countryCode =
                getCountryCode(nationality);

        String prefix =
                "EVA" +
                        countryCode +
                        "36";

        String lastCode =
                employeeRepository
                        .findLastEmployeeCodeByPrefix(prefix);

        String alpha = "A";
        int number = 1;

        // =================================================
        // GET NEXT CODE FROM LAST CODE
        // =================================================

        if (lastCode != null &&
                !lastCode.isBlank() &&
                lastCode.startsWith(prefix)) {

            String suffix =
                    lastCode.substring(
                            prefix.length()
                    );

            String extractedAlpha =
                    suffix.replaceAll(
                            "\\d",
                            ""
                    );

            String extractedNumber =
                    suffix.replaceAll(
                            "\\D",
                            ""
                    );

            if (!extractedAlpha.isBlank()) {
                alpha = extractedAlpha;
            }

            if (!extractedNumber.isBlank()) {
                number =
                        Integer.parseInt(
                                extractedNumber
                        );
            }

            // =============================================
            // NEXT NUMBER
            // =============================================

            number++;

            // =============================================
            // 99 -> NEXT ALPHABET
            // =============================================

            if (number > 99) {

                long alphaNumber = 0;

                for (char ch :
                        alpha.toCharArray()) {

                    alphaNumber =
                            alphaNumber * 26
                                    + (
                                    ch - 'A' + 1
                            );
                }

                alpha =
                        generateAlphabet(
                                alphaNumber + 1
                        );

                number = 1;
            }
        }

        // =================================================
        // SAFETY CHECK
        // =================================================
        //
        // VERY IMPORTANT:
        //
        // Agar generated employee code already database
        // mein hai, next code try karo.
        //
        // =================================================

        String employeeCode =
                prefix +
                        alpha +
                        String.format(
                                "%02d",
                                number
                        );

        while (
                employeeRepository
                        .existsByEmployeeCode(
                                employeeCode
                        )
        ) {

            number++;

            // =============================================
            // 99 -> NEXT ALPHABET
            // =============================================

            if (number > 99) {

                long alphaNumber = 0;

                for (char ch :
                        alpha.toCharArray()) {

                    alphaNumber =
                            alphaNumber * 26
                                    + (
                                    ch - 'A' + 1
                            );
                }

                alpha =
                        generateAlphabet(
                                alphaNumber + 1
                        );

                number = 1;
            }

            employeeCode =
                    prefix +
                            alpha +
                            String.format(
                                    "%02d",
                                    number
                            );
        }

        // =================================================
        // FINAL UNIQUE CODE
        // =================================================

        return employeeCode;
    }
    // =====================================================
    // COUNSELLOR DROPDOWN
    // =====================================================

    @Override
    public List<CounsellorDropdownResponse>
    getCounsellorDropdown() {

        return employeeRepository
                .getCounsellorDropdown();
    }


    // =====================================================
    // MAP CONTACTS
    // =====================================================

    private List<PersonContactDto> mapContacts(
            Person person
    ) {

        if (person == null ||
                person.getContacts() == null) {

            return List.of();
        }


        return person.getContacts()

                .stream()

                .map(contact -> {

                    PersonContactDto dto =
                            new PersonContactDto();


                    dto.setPersonContactId(
                            contact.getContactId()
                    );


                    if (contact.getContactType() != null) {

                        dto.setContactTypeId(
                                contact.getContactType()
                                        .getContactTypeId()
                        );

                        dto.setContactTypeName(
                                contact.getContactType()
                                        .getContactTypeName()
                        );
                    }


                    dto.setContactValue(
                            contact.getContactValue()
                    );

                    dto.setIsPrimary(
                            contact.getIsPrimary()
                    );


                    if (contact.getCountry() != null) {

                        dto.setCountryId(
                                contact.getCountry()
                                        .getCountryId()
                        );

                        dto.setCountryName(
                                contact.getCountry()
                                        .getCountryName()
                        );
                    }


                    return dto;

                })

                .toList();
    }


    // =====================================================
    // ALTERNATE EMAIL
    // =====================================================

    private String getAlternateEmail(
            Person person
    ) {

        return personContactRepository
                .findByPerson(person)

                .stream()

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        "ALTERNATE_EMAIL"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(PersonContact::getContactValue)

                .filter(Objects::nonNull)

                .findFirst()

                .orElse(null);
    }


    // =====================================================
    // ALTERNATE PHONE
    // =====================================================

    private String getAlternatePhone(
            Person person
    ) {

        return personContactRepository
                .findByPerson(person)

                .stream()

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        "ALTERNATE_PHONE"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(PersonContact::getContactValue)

                .filter(Objects::nonNull)

                .findFirst()

                .orElse(null);
    }

    // =====================================================
// UPDATE ALTERNATE CONTACTS ONLY
// PRIMARY EMAIL & PRIMARY PHONE ARE LOCKED
// =====================================================

    private void updateEmployeeContacts(
            Person person,
            List<PersonContactDto> contacts
    ) {

        if (contacts == null) {
            return;
        }

        List<PersonContact> existingContacts =
                personContactRepository.findByPerson(person);

        for (PersonContactDto dto : contacts) {

            if (dto == null || dto.getContactTypeId() == null) {
                continue;
            }

            ContactTypeMaster contactType =
                    contactTypeMasterRepository
                            .findById(dto.getContactTypeId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Contact Type not found: "
                                                    + dto.getContactTypeId()
                                    )
                            );

            String typeName =
                    contactType.getContactTypeName();
// =================================================
// EMAIL DUPLICATION CHECK
// =================================================

            if ("ALTERNATE_EMAIL".equalsIgnoreCase(typeName)
                    && dto.getContactValue() != null
                    && !dto.getContactValue().isBlank()) {

                String email = dto.getContactValue().trim();

                boolean emailExists =
                        personContactRepository.existsEmailForAnotherPerson(
                                email,
                                person.getPersonId()
                        );

                if (emailExists) {
                    throw new RuntimeException(
                            "This email address is already registered in the system."
                    );
                }
            }
            // =================================================
            // PRIMARY EMAIL
            // =================================================

            if ("PRIMARY_EMAIL".equalsIgnoreCase(typeName)) {

                // NEVER UPDATE PRIMARY EMAIL
                continue;
            }

            // =================================================
            // PRIMARY PHONE
            // =================================================

            if ("PRIMARY_PHONE".equalsIgnoreCase(typeName)) {

                // NEVER UPDATE PRIMARY PHONE
                continue;
            }

            // =================================================
            // ALTERNATE CONTACTS
            // =================================================

            PersonContact existing =
                    existingContacts.stream()
                            .filter(contact ->
                                    contact.getContactType() != null
                            )
                            .filter(contact ->
                                    contact.getContactType()
                                            .getContactTypeId()
                                            .equals(
                                                    contactType.getContactTypeId()
                                            )
                            )
                            .findFirst()
                            .orElse(null);

            // =================================================
            // EMPTY VALUE
            // =================================================

            if (dto.getContactValue() == null ||
                    dto.getContactValue().isBlank()) {

                if (existing != null) {
                    personContactRepository.delete(existing);
                }

                continue;
            }

            // =================================================
            // CREATE ALTERNATE CONTACT
            // =================================================

            if (existing == null) {

                PersonContact contact =
                        PersonContact.builder()
                                .person(person)
                                .contactType(contactType)
                                .contactValue(
                                        dto.getContactValue().trim()
                                )
                                .isPrimary(false)
                                .build();

                if (dto.getCountryId() != null) {

                    CountryMaster country =
                            countryMasterRepository
                                    .findById(dto.getCountryId())
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Country not found: "
                                                            + dto.getCountryId()
                                            )
                                    );

                    contact.setCountry(country);
                }

                personContactRepository.save(contact);

            } else {

                // =================================================
                // UPDATE ALTERNATE CONTACT
                // =================================================

                existing.setContactValue(
                        dto.getContactValue().trim()
                );

                existing.setIsPrimary(false);

                if (dto.getCountryId() != null) {

                    CountryMaster country =
                            countryMasterRepository
                                    .findById(dto.getCountryId())
                                    .orElseThrow(() ->
                                            new RuntimeException(
                                                    "Country not found: "
                                                            + dto.getCountryId()
                                            )
                                    );

                    existing.setCountry(country);

                } else {

                    existing.setCountry(null);
                }

                personContactRepository.save(existing);
            }
        }
    }

    // =====================================================
// GET MY PROFILE
// =====================================================

    @Override
    @Transactional(readOnly = true)
    public EmployeeProfileResponse getMyProfile() {

        User currentUser =
                currentUserService.getCurrentUser();

        if (currentUser == null ||
                currentUser.getPerson() == null) {

            throw new EmployeeNotFoundException(
                    "Authenticated user or person not found"
            );
        }

        Long personId =
                currentUser
                        .getPerson()
                        .getPersonId();

        return getEmployeeById(personId);
    }

    private void updateDocuments(
            Person person,
            List<PersonDocumentDto> documents,
            List<MultipartFile> files
    ) {

        if (documents == null || documents.isEmpty()) {
            return;
        }

        for (int i = 0; i < documents.size(); i++) {

            PersonDocumentDto dto = documents.get(i);

            if (dto == null ||
                    dto.getDocumentType() == null ||
                    dto.getDocumentType().isBlank()) {
                continue;
            }

            PersonDocument document;

            // =====================================================
            // EXISTING DOCUMENT
            // =====================================================

            if (dto.getPersonDocumentId() != null) {

                document =
                        personDocumentRepository
                                .findById(
                                        dto.getPersonDocumentId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Document not found: " +
                                                        dto.getPersonDocumentId()
                                        )
                                );

                // =================================================
                // SECURITY CHECK
                // =================================================

                if (!document.getPerson()
                        .getPersonId()
                        .equals(person.getPersonId())) {

                    throw new RuntimeException(
                            "Document does not belong to this person"
                    );
                }

            }

            // =====================================================
            // NEW DOCUMENT
            // =====================================================

            else {

                document = new PersonDocument();

                document.setPerson(person);
            }

            // =====================================================
            // DOCUMENT INFORMATION
            // =====================================================

            document.setDocumentType(
                    dto.getDocumentType().trim()
            );

            document.setDocumentNumber(
                    dto.getDocumentNumber()
            );

            // =====================================================
            // FILE
            // =====================================================

            if (files != null && i < files.size()) {

                MultipartFile file = files.get(i);

                if (file != null && !file.isEmpty()) {

                    try {

                        // -----------------------------------------
                        // Store ACTUAL FILE in MySQL
                        // -----------------------------------------

                        document.setFileData(
                                file.getBytes()
                        );

                        // -----------------------------------------
                        // Store metadata
                        // -----------------------------------------

                        document.setFileName(
                                file.getOriginalFilename()
                        );

                        document.setContentType(
                                file.getContentType()
                        );

                        document.setFileSize(
                                file.getSize()
                        );

                    } catch (IOException e) {

                        throw new RuntimeException(
                                "Failed to read document file",
                                e
                        );
                    }
                }
            }

            // =====================================================
            // SAVE
            // =====================================================

            personDocumentRepository.save(
                    document
            );
        }
    }

}