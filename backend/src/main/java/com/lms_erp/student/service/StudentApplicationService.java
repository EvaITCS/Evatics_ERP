package com.lms_erp.student.service;


import com.lms_erp.email.EmailService;
import com.lms_erp.lead.entity.LeadStatusMaster;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.LeadStatusMasterRepository;
import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.*;
import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.*;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.invitation.InvitationTokenService;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.user.entity.Role;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.RoleRepository;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lms_erp.lead.repository.LeadAssignmentRepository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentApplicationService {

    private final PersonAddressRepository personAddressRepository;
    private final PersonEducationRepository personEducationRepository;
    private final PersonVisaRepository personVisaRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final PersonWorkExperienceRepository personWorkExperienceRepository;
    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationStageRepository applicationStageRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final LeadRepository leadRepository;
    private final EmailService emailService;
    private final InvitationTokenService invitationTokenService;
    private final StudentBatchRepository studentBatchRepository;
    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;
    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final LeadAssignmentRepository leadAssignmentRepository;
    private final CurrentUserService currentUserService;

    private static final String DOC_RESUME = "Resume";
    private static final String DOC_ID_PROOF = "ID Proof";
    private static final String DOC_TRANSCRIPT = "Transcript";

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();

    private String generatePassword() {
        StringBuilder sb = new StringBuilder("EVA");
        for (int i = 0; i < 6; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private Person findPersonByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        ContactTypeMaster type = contactTypeMasterRepository.findByContactTypeName("PRIMARY_EMAIL")
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : PRIMARY_EMAIL"));

        return personContactRepository.findByContactValueAndContactType(email.trim(), type)
                .map(PersonContact::getPerson)
                .orElse(null);
    }

    private String getPrimaryEmail(Person person) {
        if (person == null) return null;
        ContactTypeMaster type = contactTypeMasterRepository.findByContactTypeName("PRIMARY_EMAIL")
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : PRIMARY_EMAIL"));

        return personContactRepository.findByPersonAndContactType(person, type)
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getPrimaryPhone(Person person) {
        if (person == null) return null;
        ContactTypeMaster type = contactTypeMasterRepository.findByContactTypeName("PRIMARY_PHONE")
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : PRIMARY_PHONE"));

        return personContactRepository.findByPersonAndContactType(person, type)
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getAlternateEmail(Person person) {
        if (person == null) return null;
        ContactTypeMaster type = contactTypeMasterRepository.findByContactTypeName("ALTERNATE_EMAIL")
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : ALTERNATE_EMAIL"));

        return personContactRepository.findByPersonAndContactType(person, type)
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getAlternatePhone(Person person) {
        if (person == null) return null;
        ContactTypeMaster type = contactTypeMasterRepository.findByContactTypeName("ALTERNATE_PHONE")
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : ALTERNATE_PHONE"));

        return personContactRepository.findByPersonAndContactType(person, type)
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private void saveOrUpdateContacts(Person person, StudentApplicationRequest request) {
        updateSingleContact(person, request.getEmail(), "PRIMARY_EMAIL");
        updateSingleContact(person, request.getPhone(), "PRIMARY_PHONE");
        updateSingleContact(person, request.getAlternateEmail(), "ALTERNATE_EMAIL");
        updateSingleContact(person, request.getAlternatePhone(), "ALTERNATE_PHONE");
    }

    private void updateSingleContact(Person person, String value, String contactTypeName) {
        ContactTypeMaster contactType = contactTypeMasterRepository.findByContactTypeName(contactTypeName)
                .orElseThrow(() -> new RuntimeException("Contact Type Not Found : " + contactTypeName));

        if (value == null || value.trim().isEmpty()) {
            personContactRepository.findByPersonAndContactType(person, contactType)
                    .ifPresent(personContactRepository::delete);
            return;
        }

        PersonContact contact = personContactRepository.findByPersonAndContactType(person, contactType)
                .orElse(new PersonContact());

        contact.setPerson(person);
        contact.setContactType(contactType);
        contact.setContactValue(value.trim());

        personContactRepository.save(contact);
    }

    private void saveCoreProfileTables(Person person, StudentApplicationRequest request) {
        // 1. Core Person Update
        person.setFirstName(request.getFirstName());
        person.setMiddleName(request.getMiddleName());
        person.setLastName(request.getLastName());

        personRepository.save(person);

        // Contact Sync
        saveOrUpdateContacts(person, request);

        // 2. Address Update
        personAddressRepository.deleteByPersonPersonId(person.getPersonId());

        PersonAddress address = new PersonAddress();

        address.setPerson(person);

        String houseNumber = request.getHouseNumber();
        String streetAddress = request.getAddressLine();

        String fullAddress = "";

        if (houseNumber != null && !houseNumber.isBlank()) {
            fullAddress = houseNumber.trim();
        }

        if (streetAddress != null && !streetAddress.isBlank()) {

            if (!fullAddress.isBlank()) {
                fullAddress += " ";
            }

            fullAddress += streetAddress.trim();
        }

        address.setAddressLine1(
                fullAddress.isBlank() ? null : fullAddress
        );

        address.setZipcode(request.getZipcode());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setCountry(request.getCountry());

        personAddressRepository.save(address);

        // 3. Visa Update
        personVisaRepository.deleteByPersonPersonId(person.getPersonId());
        if (request.getVisaType() != null && !request.getVisaType().isBlank()) {
            PersonVisa visa = new PersonVisa();
            visa.setPerson(person);
            visa.setVisaType(request.getVisaType());

            visa.setEadType(request.getEadType());

            if (request.getVisaExpiryDate() != null && !request.getVisaExpiryDate().isBlank()) {
                visa.setVisaExpiryDate(parseSafeDate(request.getVisaExpiryDate()));
            }
            personVisaRepository.save(visa);
        }

        // 4. Education Update
        if (request.getEducations() != null &&
                !request.getEducations().isEmpty()) {

            personEducationRepository.deleteByPersonPersonId(person.getPersonId());

            for (EducationRequest eduReq : request.getEducations()) {

                if (eduReq.getInstituteName() == null ||
                        eduReq.getInstituteName().isBlank()) {

                    continue;
                }

                PersonEducation edu = new PersonEducation();

                edu.setPerson(person);

                edu.setInstituteName(eduReq.getInstituteName());

                edu.setFieldOfStudy(eduReq.getFieldOfStudy());

                if (eduReq.getPassingYear() != null &&
                        !eduReq.getPassingYear().isBlank()) {

                    edu.setPassingYear(
                            Integer.parseInt(
                                    eduReq.getPassingYear().trim()
                            )
                    );

                }

                edu.setQualification(
                        eduReq.getQualification()
                );
                personEducationRepository.save(edu);

            }

        }

        // =====================================================
        // 5. WORK EXPERIENCE UPDATE
        // =====================================================

        if (request.getExperiences() != null) {

            // IMPORTANT:
            // Empty list means student removed all experiences.
            // Therefore old records must also be deleted.
            personWorkExperienceRepository
                    .deleteByPersonPersonId(person.getPersonId());

            for (ExperienceRequest expReq : request.getExperiences()) {

                // Skip completely empty experience row
                if ((expReq.getCompanyName() == null ||
                        expReq.getCompanyName().isBlank())
                        &&
                        (expReq.getDesignation() == null ||
                                expReq.getDesignation().isBlank())
                        &&
                        expReq.getStartDate() == null
                        &&
                        expReq.getEndDate() == null
                        &&
                        !Boolean.TRUE.equals(expReq.getCurrentlyWorking())) {

                    continue;
                }

                PersonWorkExperience exp =
                        new PersonWorkExperience();

                exp.setPerson(person);

                exp.setCompanyName(
                        expReq.getCompanyName()
                );

                exp.setDesignation(
                        expReq.getDesignation()
                );

                exp.setStartDate(
                        expReq.getStartDate()
                );

                /*
                 * If currently working is TRUE,
                 * end date should remain NULL.
                 */
                boolean currentlyWorking =
                        Boolean.TRUE.equals(
                                expReq.getCurrentlyWorking()
                        );

                exp.setCurrentlyWorking(
                        currentlyWorking
                );

                if (currentlyWorking) {

                    exp.setEndDate(null);

                } else {

                    exp.setEndDate(
                            expReq.getEndDate()
                    );
                }

                personWorkExperienceRepository.save(exp);
            }
        }

        // 6. Documents Update
        // =====================================================
        // 6. DOCUMENTS
        // =====================================================

        if (request.getResume() != null &&
                !request.getResume().isEmpty()) {

            saveDocument(
                    person,
                    DOC_RESUME,
                    request.getResume()
            );
        }

        if (request.getTranscript() != null &&
                !request.getTranscript().isEmpty()) {

            saveDocument(
                    person,
                    DOC_TRANSCRIPT,
                    request.getTranscript()
            );
        }

        if (request.getIdProof() != null &&
                !request.getIdProof().isEmpty()) {

            saveDocument(
                    person,
                    DOC_ID_PROOF,
                    request.getIdProof()
            );
        }
    }

    /*
     * Database mein complete address ek hi column mein stored hai.
     *
     * Example:
     *
     * 1111 Eastman Brook Trail
     *
     * Is method se:
     *
     * houseNumber = 1111
     */
    private String extractHouseNumber(String fullAddress) {

        if (fullAddress == null || fullAddress.isBlank()) {
            return null;
        }

        String address = fullAddress.trim();

        java.util.regex.Matcher matcher =
                java.util.regex.Pattern
                        .compile("^([0-9]+(?:[-/][A-Za-z0-9]+)?[A-Za-z]?)\\s+(.+)$")
                        .matcher(address);

        if (matcher.matches()) {
            return matcher.group(1);
        }

        return null;
    }

    /*
     * Database mein:
     *
     * 1111 Eastman Brook Trail
     *
     * Is method se:
     *
     * streetAddress = Eastman Brook Trail
     */
    private String extractStreetAddress(String fullAddress) {

        if (fullAddress == null || fullAddress.isBlank()) {
            return null;
        }

        String address = fullAddress.trim();

        java.util.regex.Matcher matcher =
                java.util.regex.Pattern
                        .compile("^([0-9]+(?:[-/][A-Za-z0-9]+)?[A-Za-z]?)\\s+(.+)$")
                        .matcher(address);

        if (matcher.matches()) {
            return matcher.group(2);
        }

        /*
         * Agar address number se start nahi hota,
         * to poora address street address maan lo.
         */
        return address;
    }

    private void syncApplicationFields(StudentApplicationRequest request, StudentApplication application) {

        if (request.getCurrentStep() != null) {
            application.setCurrentStep(request.getCurrentStep());
        }
    }

    @Transactional
    public StudentRegistrationResponse saveApplication(StudentApplicationRequest request) {
        Person person = findPersonByEmail(request.getEmail());
        if (person == null) {
            person = new Person();
            person.setFirstName(request.getFirstName());
            person.setMiddleName(request.getMiddleName());
            person.setLastName(request.getLastName());
            person = personRepository.save(person);
            saveOrUpdateContacts(person, request);
        }

        StudentApplication application =
                studentApplicationRepository
                        .findById(person.getPersonId())
                        .orElse(new StudentApplication());

        application.setPerson(person);

        leadRepository.findById(person.getPersonId())
                .ifPresent(lead -> {

                    leadAssignmentRepository
                            .findByLead_PersonIdAndIsActiveTrue(lead.getPersonId())
                            .ifPresent(assignment ->
                                    application.setCounselor(assignment.getEmployee())
                            );

                    lead.setLeadStatus(getLeadStatus("CONVERTED"));

                    leadRepository.save(lead);
                });

        ApplicationStageMaster stage =
                applicationStageRepository
                        .findByApplicationStageName("REGISTERED")
                        .orElseThrow(() ->
                                new RuntimeException("Stage REGISTERED Not Found"));

        application.setApplicationStage(stage);

        syncApplicationFields(request, application);

        studentApplicationRepository.save(application);

        String generatedPassword = generatePassword();

        User user = userRepository.findByUsername(request.getEmail())
                .orElse(null);

        if (user == null) {

            user = new User();
            user.setUsername(request.getEmail());
            user.setPassword(generatedPassword);
            user.setPerson(person);
            user.setIsActive(true);
            user.setIsLocked(false);
            user.setFailedAttempts(0);
            user.setMustChangePassword(true);
            user.setPasswordChangedAt(null);

            user = userRepository.save(user);

            assignRoleToUser(user, "LEAD");

        } else {

            log.debug(
                    "User already exists for email {}. Role will not be changed during application save.",
                    request.getEmail()
            );
        }

        saveCoreProfileTables(person, request);

        return StudentRegistrationResponse.builder()
                .personId(person.getPersonId())
                .username(request.getEmail())
                .temporaryPassword(generatedPassword)
                .message("Student Registration Completed Successfully")
                .build();
    }

    @Transactional
    public void saveStudentProfile(StudentApplicationRequest request) {
        Person person = findPersonByEmail(request.getEmail());
        if (person == null) {
            throw new RuntimeException("Person not found with email: " + request.getEmail());
        }

        StudentApplication application = studentApplicationRepository.findById(person.getPersonId())
                .orElse(new StudentApplication());

        application.setPerson(person);
        syncApplicationFields(request, application);

        studentApplicationRepository.save(application);
        saveCoreProfileTables(person, request);
    }

    @Transactional
    public void updateApplication(StudentApplicationRequest request) {
        Person person = findPersonByEmail(request.getEmail());
        if (person == null) {
            throw new RuntimeException("Person Not Found");
        }

        StudentApplication application = studentApplicationRepository.findById(person.getPersonId())
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        syncApplicationFields(request, application);
        studentApplicationRepository.save(application);
        saveCoreProfileTables(person, request);
    }

    @Transactional
    public void finalSubmit(String email) {
        Person person = findPersonByEmail(email);
        if (person == null) {
            throw new RuntimeException("Person not found");
        }

        StudentApplication application = studentApplicationRepository.findById(person.getPersonId())
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        ApplicationStageMaster submittedStage = applicationStageRepository.findByApplicationStageName("SUBMITTED")
                .orElseThrow(() -> new RuntimeException("Stage SUBMITTED Not Found"));

        application.setApplicationStage(submittedStage);
        application.setAppliedDate(LocalDate.now());
        application.setRecheckReason(null);

        studentApplicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public StudentApplicationResponse getStudentProfile(String email) {
        Person person = findPersonByEmail(email);
        if (person == null) {
            throw new RuntimeException("Person Not Found with email: " + email);
        }

        StudentApplication application = studentApplicationRepository.findById(person.getPersonId()).orElse(null);

        List<PersonAddress> addresses = personAddressRepository.findByPersonPersonId(person.getPersonId());
        PersonAddress address = addresses.isEmpty() ? null : addresses.get(0);

        List<PersonVisa> visas = personVisaRepository.findByPersonPersonId(person.getPersonId());
        PersonVisa visa = visas.isEmpty() ? null : visas.get(0);

        List<PersonEducation> eduEntities = personEducationRepository.findByPersonPersonId(person.getPersonId());
        List<EducationRequest> eduList = new ArrayList<>();
        for (PersonEducation edu : eduEntities) {
            EducationRequest eduDto = new EducationRequest();
            eduDto.setQualification(edu.getQualification());
            eduDto.setInstituteName(edu.getInstituteName());
            eduDto.setFieldOfStudy(edu.getFieldOfStudy());
            if (edu.getPassingYear() != null) {
                eduDto.setPassingYear(String.valueOf(edu.getPassingYear()));
            }
            eduList.add(eduDto);
        }

        List<PersonWorkExperience> expEntities =
                personWorkExperienceRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        );

        List<ExperienceRequest> expList =
                new ArrayList<>();

        for (PersonWorkExperience exp : expEntities) {

            ExperienceRequest expDto =
                    new ExperienceRequest();

            expDto.setCompanyName(
                    exp.getCompanyName()
            );

            expDto.setDesignation(
                    exp.getDesignation()
            );

            // Entity already has LocalDate
            if (exp.getStartDate() != null) {

                expDto.setStartDate(
                        exp.getStartDate()
                );
            }

            if (exp.getEndDate() != null) {

                expDto.setEndDate(
                        exp.getEndDate()
                );
            }

            expDto.setCurrentlyWorking(
                    Boolean.TRUE.equals(
                            exp.getCurrentlyWorking()
                    )
            );

            expList.add(expDto);
        }

        List<PersonDocument> docEntities =
                personDocumentRepository
                        .findByPersonPersonId(
                                person.getPersonId()
                        );

        String resumeUrl = null;
        String transcriptUrl = null;
        String idProofUrl = null;

        for (PersonDocument doc : docEntities) {

            if (doc.getDocumentType() == null) {
                continue;
            }

            String fileUrl =
                    "/api/person-documents/"
                            + doc.getPersonDocumentId()
                            + "/file";

            if (DOC_RESUME.equals(
                    doc.getDocumentType()
            )) {

                resumeUrl = fileUrl;

            } else if (DOC_ID_PROOF.equals(
                    doc.getDocumentType()
            )) {

                idProofUrl = fileUrl;

            } else if (DOC_TRANSCRIPT.equals(
                    doc.getDocumentType()
            )) {

                transcriptUrl = fileUrl;
            }
        }

        /*
         * =====================================================
         * ADDRESS READ / SPLIT
         * =====================================================
         *
         * Database:
         *
         * address_line_1 = "1111 Eastman Brook Trail"
         *
         * Frontend response:
         *
         * houseNumber = "1111"
         * addressLine = "Eastman Brook Trail"
         *
         * Database mein house number ka separate column nahi hai.
         */

        String fullAddress =
                address != null
                        ? address.getAddressLine1()
                        : null;

        String houseNumber =
                extractHouseNumber(fullAddress);

        String streetAddress =
                extractStreetAddress(fullAddress);

        return StudentApplicationResponse.builder()
                .personId(person.getPersonId())
                .currentStep(application != null ? application.getCurrentStep() : 0)
                .firstName(person.getFirstName())
                .middleName(person.getMiddleName())
                .lastName(person.getLastName())
                .email(getPrimaryEmail(person))
                .phone(getPrimaryPhone(person))
                .alternatePhone(getAlternatePhone(person))
                .alternateEmail(getAlternateEmail(person))

                /*
                 * Frontend ke separate fields.
                 * Database mein dono ek hi column se aa rahe hain.
                 */
                .houseNumber(houseNumber)
                .addressLine(streetAddress)

                .city(address != null ? address.getCity() : null)
                .state(address != null ? address.getState() : null)
                .country(address != null ? address.getCountry() : null)
                .zipcode(address != null ? address.getZipcode() : null)
                .visaType(visa != null ? visa.getVisaType() : null)
                .eadType(visa != null ? visa.getEadType() : null)
                .visaExpiryDate(visa != null ? visa.getVisaExpiryDate() : null)
                .resume(resumeUrl)
                .transcript(transcriptUrl)
                .idProof(idProofUrl)
                .recheckReason(application != null ? application.getRecheckReason() : null)
                .applicationStage(
                        application != null &&
                                application.getApplicationStage() != null
                                ? application.getApplicationStage().getApplicationStageName()
                                : "NOT_STARTED"
                )
                .educations(eduList)
                .experiences(expList)
                .build();
    }

    private void saveDocument(
            Person person,
            String documentName,
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            return;
        }

        try {

            List<PersonDocument> existingDocuments =
                    personDocumentRepository
                            .findByPersonPersonId(
                                    person.getPersonId()
                            );

            // =================================================
            // EXISTING DOCUMENT
            // =================================================

            for (PersonDocument existing : existingDocuments) {

                if (documentName.equals(
                        existing.getDocumentType()
                )) {

                    existing.setFileName(
                            file.getOriginalFilename()
                    );

                    existing.setFileData(
                            file.getBytes()
                    );

                    existing.setContentType(
                            file.getContentType()
                    );

                    existing.setFileSize(
                            file.getSize()
                    );

                    personDocumentRepository.save(
                            existing
                    );

                    return;
                }
            }

            // =================================================
            // NEW DOCUMENT
            // =================================================

            PersonDocument document =
                    new PersonDocument();

            document.setPerson(person);

            document.setDocumentType(
                    documentName
            );

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

            personDocumentRepository.save(
                    document
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save document: "
                            + documentName,
                    e
            );
        }
    }

    private LocalDate parseSafeDate(String dateStr) {
        List<DateTimeFormatter> formatters = new ArrayList<>();
        formatters.add(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        formatters.add(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        formatters.add(DateTimeFormatter.ofPattern("MM/dd/yyyy"));
        formatters.add(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateStr.trim(), formatter);
            } catch (DateTimeParseException ignored) {
            }
        }
        throw new RuntimeException("Invalid Date format. Supported formats are yyyy-MM-dd, dd/MM/yyyy, MM/dd/yyyy");
    }

    @Transactional
    public void sendInvitationEmail(SendInvitationEmailRequest request) {
        StudentApplication application = studentApplicationRepository.findById(request.getPersonId())
                .orElseThrow(() -> new RuntimeException("Application not found."));

        Person person = application.getPerson();
        String fullName = person.getFirstName() + (person.getLastName() != null ? " " + person.getLastName() : "");
        String email = getPrimaryEmail(person);

        String applicationLink = invitationTokenService.generateInvitationLink(application);

        emailService.sendApplicationInvitationEmail(
                email,
                fullName,
                request.getUsername(),
                request.getTemporaryPassword(),
                applicationLink
        );
    }

    @Transactional(readOnly = true)
    public StudentApplicationStageResponse getApplicationStage(String email) {

        Person person = findPersonByEmail(email);
        if (person == null) {
            throw new RuntimeException("Person Not Found");
        }

        StudentApplication application = studentApplicationRepository
                .findById(person.getPersonId())
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        Long applicationStageId = application.getApplicationStage() != null
                ? application.getApplicationStage().getApplicationStageId()
                : null;

        String stageName = application.getApplicationStage() != null
                ? application.getApplicationStage().getApplicationStageName()
                : "NOT_STARTED";

        String currentStage;

        if ("APPLICATION_STARTED".equals(stageName)
                || "DRAFT".equals(stageName)
                || "SUBMITTED".equals(stageName)) {

            currentStage = stageName;

        } else {

            StudentBatch studentBatch = studentBatchRepository
                    .findTopByStudentApplicationOrderByAssignedDateDesc(application)
                    .orElse(null);

            if (studentBatch == null) {
                currentStage = "WAITING_BATCH";
            } else {
                LocalDate startDate = studentBatch.getBatch().getStartDate();
                currentStage = LocalDate.now().isBefore(startDate)
                        ? "WAITING_BATCH"
                        : "TRAINING";
            }
        }

        return new StudentApplicationStageResponse(
                applicationStageId,
                stageName,
                currentStage,
                application.getRecheckReason()
        );
    }

    @Transactional
    public void updateApplicationStage(
            String email,
            Long applicationStageId
    ) {

        Person person = findPersonByEmail(email);

        StudentApplication app = studentApplicationRepository
                .findById(person.getPersonId())
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        ApplicationStageMaster stage =
                applicationStageRepository
                        .findById(applicationStageId)
                        .orElseThrow(() ->
                                new RuntimeException("Application Stage Not Found"));

        app.setApplicationStage(stage);

        studentApplicationRepository.save(app);
    }


    private void assignRoleToUser(
            User user,
            String roleName
    ) {

        Role role = roleRepository
                .findByRoleName(roleName)
                .orElseThrow(() ->
                        new RuntimeException(
                                roleName + " role not found"
                        )
                );

        UserRole userRole = userRoleRepository
                .findByUser(user)
                .orElseGet(UserRole::new);

        userRole.setUser(user);
        userRole.setRole(role);

        userRoleRepository.save(userRole);
    }

    private LeadStatusMaster getLeadStatus(String statusName) {
        return leadStatusMasterRepository.findByStatusName(statusName)
                .orElseThrow(() -> new RuntimeException("Lead Status not found : " + statusName));
    }


    public void promoteToStudent(Long personId) {

        User user = userRepository
                .findByPersonPersonId(personId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found for personId: " + personId
                        )
                );

        Role studentRole = roleRepository
                .findByRoleName("STUDENT")
                .orElseThrow(() ->
                        new RuntimeException(
                                "STUDENT role not found"
                        )
                );

        UserRole userRole = userRoleRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User role not found for userId: "
                                        + user.getUserId()
                        )
                );

        userRole.setRole(studentRole);

        userRoleRepository.save(userRole);

        log.info(
                "User promoted to STUDENT. userId={}, personId={}",
                user.getUserId(),
                personId
        );
    }

}