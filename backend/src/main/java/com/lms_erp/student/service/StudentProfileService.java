package com.lms_erp.student.service;

import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.*;
import com.lms_erp.student.dto.EducationRequest;
import com.lms_erp.student.dto.ExperienceRequest;
import com.lms_erp.student.dto.StudentProfileResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.StudentApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentApplicationRepository studentApplicationRepository;
    private final ProfileChangeRequestService profileChangeRequestService;
    private final PersonAddressRepository personAddressRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final PersonEducationRepository personEducationRepository;
    private final PersonWorkExperienceRepository personWorkExperienceRepository;
    private final PersonVisaRepository personVisaRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;
    private final PersonContactRepository personContactRepository;

    private static final String DOC_RESUME = "Resume";
    private static final String DOC_ID_PROOF = "ID Proof";
    private static final String DOC_TRANSCRIPT = "Transcript";

    private Person getPersonByPrimaryEmail(String email) {
        ContactTypeMaster emailType = contactTypeMasterRepository
                .findByContactTypeName("PRIMARY_EMAIL")
                .orElseThrow(() -> new RuntimeException("PRIMARY_EMAIL not found"));

        return personContactRepository
                .findByContactValueAndContactType(email.trim(), emailType)
                .orElseThrow(() -> new RuntimeException("Person not found"))
                .getPerson();
    }

    private StudentApplication getCurrentApplication(String email) {
        Person person = getPersonByPrimaryEmail(email);

        return studentApplicationRepository
                .findByPerson(person)
                .orElseThrow(() -> new RuntimeException("Student Application not found"));
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(String email) {
        Person person = getPersonByPrimaryEmail(email);

        StudentApplication app = studentApplicationRepository
                .findByPerson(person)
                .orElseThrow(() -> new RuntimeException("Student Application not found"));

        StudentProfileResponse response = new StudentProfileResponse();

        response.setPersonId(person.getPersonId());

        if (app.getApplicationStage() != null) {
            response.setApplicationStageId(
                    app.getApplicationStage().getApplicationStageId()
            );
            response.setApplicationStage(
                    app.getApplicationStage().getApplicationStageName()
            );
        }

        response.setRecheckReason(app.getRecheckReason());

        response.setFirstName(person.getFirstName());
        response.setMiddleName(person.getMiddleName());
        response.setLastName(person.getLastName());
        response.setEmail(getEmail(person));
        response.setAlternateEmail(getAlternateEmail(person));
        response.setPhone(getPhone(person));
        response.setAlternatePhone(getAlternatePhone(person));

        List<PersonVisa> visas =
                personVisaRepository.findByPersonPersonId(person.getPersonId());

        if (!visas.isEmpty()) {
            PersonVisa visa = visas.get(0);

            response.setVisaType(visa.getVisaType());
            response.setEadType(visa.getEadType());
            response.setVisaExpiryDate(visa.getVisaExpiryDate());
        }

        List<EducationRequest> educations = new ArrayList<>();

        List<PersonEducation> educationEntities =
                personEducationRepository.findByPersonPersonId(person.getPersonId());

        for (PersonEducation edu : educationEntities) {
            EducationRequest dto = new EducationRequest();

            dto.setQualification(edu.getQualification());
            dto.setInstituteName(edu.getInstituteName());
            dto.setFieldOfStudy(edu.getFieldOfStudy());

            if (edu.getPassingYear() != null) {
                dto.setPassingYear(String.valueOf(edu.getPassingYear()));
            }

            educations.add(dto);
        }

        response.setEducations(educations);

        List<ExperienceRequest> experiences = new ArrayList<>();

        List<PersonWorkExperience> experienceEntities =
                personWorkExperienceRepository.findByPersonPersonId(person.getPersonId());

        for (PersonWorkExperience exp : experienceEntities) {

            ExperienceRequest dto = new ExperienceRequest();

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
                    Boolean.TRUE.equals(
                            exp.getCurrentlyWorking()
                    )
            );

            experiences.add(dto);
        }

        response.setExperiences(experiences);

        List<PersonAddress> addresses =
                personAddressRepository.findByPersonPersonId(person.getPersonId());

        if (!addresses.isEmpty()) {
            PersonAddress address = addresses.get(0);

            response.setAddressLine(address.getAddressLine1());
            response.setCity(address.getCity());
            response.setState(address.getState());
            response.setCountry(address.getCountry());
            response.setZipcode(address.getZipcode());
        }

        List<PersonDocument> documents =
                personDocumentRepository.findByPersonPersonId(person.getPersonId());

        for (PersonDocument doc : documents) {
            if (doc.getDocumentType() == null ||
                    doc.getFileData() == null ||
                    doc.getFileData().length == 0) {
                continue;
            }

            String fileUrl =
                    "/api/person-documents/" +
                            doc.getPersonDocumentId() +
                            "/file";

            if (DOC_RESUME.equals(doc.getDocumentType())) {
                response.setResume(fileUrl);
            } else if (DOC_ID_PROOF.equals(doc.getDocumentType())) {
                response.setIdProof(fileUrl);
            } else if (DOC_TRANSCRIPT.equals(doc.getDocumentType())) {
                response.setTranscript(fileUrl);
            }
        }

        return response;
    }

    @Transactional
    public void addEducation(
            String email,
            EducationRequest request
    ) {
        StudentApplication app = getCurrentApplication(email);

        profileChangeRequestService.createRequest(
                app.getPerson(),
                "EDUCATION",
                "ADD",
                null,
                request
        );
    }

    @Transactional
    public void addExperience(
            String email,
            ExperienceRequest request
    ) {
        StudentApplication app = getCurrentApplication(email);

        profileChangeRequestService.createRequest(
                app.getPerson(),
                "EXPERIENCE",
                "ADD",
                null,
                request
        );
    }

    @Transactional
    public void updatePersonal(
            String email,
            StudentProfileResponse request
    ) {
        StudentApplication app = getCurrentApplication(email);

        profileChangeRequestService.createRequest(
                app.getPerson(),
                "PERSONAL",
                "UPDATE",
                null,
                request
        );
    }

    // =========================================================
// UPDATE ADDRESS
// =========================================================

    @Transactional
    public void updateAddress(
            String email,
            StudentProfileResponse request
    ) {

        StudentApplication app =
                getCurrentApplication(email);

        profileChangeRequestService.createRequest(
                app.getPerson(),
                "ADDRESS",
                "UPDATE",
                null,
                request
        );
    }

    @Transactional
    public void updateVisa(
            String email,
            StudentProfileResponse request
    ) {
        StudentApplication app = getCurrentApplication(email);

        List<PersonVisa> visas =
                personVisaRepository.findByPersonPersonId(
                        app.getPerson().getPersonId()
                );

        if (visas.isEmpty()) {
            throw new RuntimeException("Visa record not found");
        }

        profileChangeRequestService.createRequest(
                app.getPerson(),
                "VISA",
                "UPDATE",
                visas.get(0).getPersonVisaId(),
                request
        );
    }

    @Transactional
    public void uploadDocument(
            String email,
            String documentType,
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Document file is required"
            );
        }

        StudentApplication app =
                getCurrentApplication(email);

        String type;

        switch (documentType) {

            case "resume" ->
                    type = DOC_RESUME;

            case "idProof" ->
                    type = DOC_ID_PROOF;

            case "transcript" ->
                    type = DOC_TRANSCRIPT;

            default ->
                    throw new RuntimeException(
                            "Invalid Document Type: " +
                                    documentType
                    );
        }

        try {

            /*
             * Check whether this document type already exists.
             *
             * If it exists:
             *     UPDATE request
             *
             * If it does not exist:
             *     ADD request
             */

            List<PersonDocument> documents =
                    personDocumentRepository
                            .findByPersonPersonId(
                                    app.getPerson()
                                            .getPersonId()
                            );

            PersonDocument existingDocument =
                    documents.stream()
                            .filter(doc ->
                                    type.equals(
                                            doc.getDocumentType()
                                    )
                            )
                            .findFirst()
                            .orElse(null);

            /*
             * Convert uploaded file into Base64.
             *
             * The actual PersonDocument will NOT be saved now.
             * It will be saved only after admin approval.
             */

            String base64File =
                    java.util.Base64
                            .getEncoder()
                            .encodeToString(
                                    file.getBytes()
                            );

            java.util.Map<String, Object> newData =
                    new java.util.LinkedHashMap<>();

            newData.put(
                    "documentType",
                    type
            );

            newData.put(
                    "fileName",
                    file.getOriginalFilename()
            );

            newData.put(
                    "contentType",
                    file.getContentType()
            );

            newData.put(
                    "fileSize",
                    file.getSize()
            );

            newData.put(
                    "fileData",
                    base64File
            );

            /*
             * Existing document
             *      -> UPDATE
             *
             * New document
             *      -> ADD
             */

            String operationType =
                    existingDocument != null
                            ? "UPDATE"
                            : "ADD";

            Long targetId =
                    existingDocument != null
                            ? existingDocument
                              .getPersonDocumentId()
                            : null;

            profileChangeRequestService.createRequest(
                    app.getPerson(),
                    "DOCUMENT",
                    operationType,
                    targetId,
                    newData
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to prepare document change request",
                    e
            );
        }
    }

    private String getEmail(Person person) {
        return contactTypeMasterRepository
                .findByContactTypeName("PRIMARY_EMAIL")
                .flatMap(type ->
                        personContactRepository
                                .findByPersonAndContactType(person, type)
                )
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getPhone(Person person) {
        return contactTypeMasterRepository
                .findByContactTypeName("PRIMARY_PHONE")
                .flatMap(type ->
                        personContactRepository
                                .findByPersonAndContactType(person, type)
                )
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getAlternateEmail(Person person) {
        return contactTypeMasterRepository
                .findByContactTypeName("ALTERNATE_EMAIL")
                .flatMap(type ->
                        personContactRepository
                                .findByPersonAndContactType(person, type)
                )
                .map(PersonContact::getContactValue)
                .orElse(null);
    }

    private String getAlternatePhone(Person person) {
        return contactTypeMasterRepository
                .findByContactTypeName("ALTERNATE_PHONE")
                .flatMap(type ->
                        personContactRepository
                                .findByPersonAndContactType(person, type)
                )
                .map(PersonContact::getContactValue)
                .orElse(null);
    }
}