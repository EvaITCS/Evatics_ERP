package com.lms_erp.student.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonEducationRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.repository.PersonVisaRepository;
import com.lms_erp.person.repository.PersonWorkExperienceRepository;
import com.lms_erp.student.dto.EducationRequest;
import com.lms_erp.student.dto.ExperienceRequest;
import com.lms_erp.student.dto.ProfileChangeRequestDto;
import com.lms_erp.student.dto.ProfileChangeReviewDto;
import com.lms_erp.student.entity.ProfileChangeRequest;
import com.lms_erp.student.repository.ProfileChangeRequestRepository;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lms_erp.person.repository.PersonDocumentRepository;
import com.lms_erp.person.entity.PersonAddress;
import com.lms_erp.person.repository.PersonAddressRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileChangeRequestService {

    private final ProfileChangeRequestRepository repository;
    private final ObjectMapper objectMapper;
    private final PersonRepository personRepository;
    private final PersonEducationRepository educationRepository;
    private final PersonWorkExperienceRepository experienceRepository;
    private final UserRepository userRepository;
    private final PersonVisaRepository visaRepository;
    private final ContactTypeMasterRepository contactTypeMasterRepository;
    private final PersonContactRepository personContactRepository;
    private final PersonDocumentRepository documentRepository;
    private final PersonAddressRepository personAddressRepository;


    public record PendingDocumentResponse(
            byte[] fileData,
            String fileName,
            String contentType
    ) {}

    @Transactional
    public void createRequest(
            Person person,
            String requestType,
            String operationType,
            Long targetId,
            Object newData
    ) {
        if (person == null || person.getPersonId() == null) {
            throw new IllegalArgumentException("Person is required");
        }

        if (requestType == null || requestType.isBlank()) {
            throw new IllegalArgumentException("Request type is required");
        }

        if (operationType == null || operationType.isBlank()) {
            throw new IllegalArgumentException("Operation type is required");
        }

        if (newData == null) {
            throw new IllegalArgumentException("New data is required");
        }

        String type = requestType.trim().toUpperCase();
        String operation = operationType.trim().toUpperCase();

        validateTargetId(type, operation, targetId);

        try {
            String serializedData =
                    objectMapper.writeValueAsString(newData);

            ProfileChangeRequest request =
                    ProfileChangeRequest.builder()
                            .candidatePersonId(person.getPersonId())
                            .requestType(type)
                            .operationType(operation)
                            .targetId(targetId)
                            .newData(serializedData)
                            .status("PENDING")
                            .build();

            repository.save(request);

        } catch (Exception e) {
            log.error(
                    "Unable to create profile change request. personId={}",
                    person.getPersonId(),
                    e
            );

            throw new RuntimeException(
                    "Unable to create profile change request",
                    e
            );
        }
    }

    @Transactional(readOnly = true)
    public List<ProfileChangeRequestDto> getCandidateRequests(
            Long candidatePersonId
    ) {
        List<ProfileChangeRequest> requests =
                repository.findByCandidatePersonIdAndStatus(
                        candidatePersonId,
                        "PENDING"
                );

        return requests.stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProfileChangeRequestDto> getPendingRequests() {
        return repository.findByStatus("PENDING")
                .stream()
                .map(request -> {
                    Person person =
                            personRepository
                                    .findById(
                                            request.getCandidatePersonId()
                                    )
                                    .orElse(null);

                    return ProfileChangeRequestDto.builder()
                            .requestId(request.getRequestId())
                            .personId(request.getCandidatePersonId())
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
                            .requestType(request.getRequestType())
                            .operationType(request.getOperationType())
                            .targetId(request.getTargetId())
                            .newData(request.getNewData())
                            .status(request.getStatus())
                            .rejectionReason(
                                    request.getRejectionReason()
                            )
                            .build();
                })
                .toList();
    }

    // =====================================================
    // GET PENDING DOCUMENT
    // =====================================================

    @Transactional(readOnly = true)
    public PendingDocumentResponse getPendingRequestDocument(
            Long requestId
    ) {

        ProfileChangeRequest request =
                repository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile change request not found"
                                )
                        );

        // Only PENDING requests can be viewed
        if (!"PENDING".equalsIgnoreCase(
                request.getStatus()
        )) {
            throw new RuntimeException(
                    "Document is no longer pending"
            );
        }

        // Make sure this is actually a DOCUMENT request
        if (!"DOCUMENT".equalsIgnoreCase(
                request.getRequestType()
        )) {
            throw new RuntimeException(
                    "This request is not a document request"
            );
        }

        try {

            JsonNode data =
                    objectMapper.readTree(
                            request.getNewData()
                    );

            String base64File =
                    data.has("fileData") &&
                            !data.get("fileData").isNull()
                            ? data.get("fileData").asText()
                            : null;

            if (base64File == null ||
                    base64File.isBlank()) {

                throw new RuntimeException(
                        "Document file data not found"
                );
            }

            byte[] fileData =
                    java.util.Base64
                            .getDecoder()
                            .decode(base64File);

            String fileName =
                    data.has("fileName") &&
                            !data.get("fileName").isNull()
                            ? data.get("fileName").asText()
                            : "document";

            String contentType =
                    data.has("contentType") &&
                            !data.get("contentType").isNull()
                            ? data.get("contentType").asText()
                            : "application/octet-stream";

            return new PendingDocumentResponse(
                    fileData,
                    fileName,
                    contentType
            );

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to read pending document",
                    e
            );
        }
    }

    @Transactional
    public ProfileChangeRequest reviewRequest(
            Long requestId,
            ProfileChangeReviewDto dto
    ) {
        Long reviewerPersonId = getAuthenticatedPersonId();

        ProfileChangeRequest request =
                repository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile change request not found"
                                )
                        );

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException(
                    "Request has already been reviewed"
            );
        }

        if (dto == null ||
                dto.getAction() == null ||
                dto.getAction().isBlank()) {
            throw new RuntimeException(
                    "Review action is required"
            );
        }

        String action =
                dto.getAction()
                        .trim()
                        .toUpperCase();

        if ("APPROVE".equals(action)) {
            applyProfileChange(request);

            request.setStatus("APPROVED");
            request.setRejectionReason(null);

        } else if ("REJECT".equals(action)) {

            if (dto.getRejectionReason() == null ||
                    dto.getRejectionReason().isBlank()) {
                throw new RuntimeException(
                        "Rejection reason is required"
                );
            }

            request.setStatus("REJECTED");
            request.setRejectionReason(
                    dto.getRejectionReason()
            );

        } else {
            throw new RuntimeException(
                    "Invalid review action: " + action
            );
        }

        request.setReviewedByPersonId(
                reviewerPersonId
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        return repository.save(request);
    }

    private void applyProfileChange(
            ProfileChangeRequest request
    ) {
        String requestType =
                request.getRequestType()
                        .trim()
                        .toUpperCase();

        String operationType =
                request.getOperationType()
                        .trim()
                        .toUpperCase();

        switch (requestType) {
            case "PERSONAL" ->
                    applyPersonalChange(
                            request,
                            operationType
                    );

            case "ADDRESS" ->
                    applyAddressChange(
                            request,
                            operationType
                    );

            case "EDUCATION" ->
                    applyEducationChange(
                            request,
                            operationType
                    );

            case "EXPERIENCE", "WORK_EXPERIENCE" ->
                    applyExperienceChange(
                            request,
                            operationType
                    );

            case "VISA" ->
                    applyVisaChange(
                            request,
                            operationType
                    );

            case "DOCUMENT" ->
                    applyDocumentChange(
                            request,
                            operationType
                    );

            default ->
                    throw new RuntimeException(
                            "Unsupported profile request type: " +
                                    requestType
                    );
        }
    }

    private void applyPersonalChange(
            ProfileChangeRequest request,
            String operationType
    ) {
        if (!"UPDATE".equals(operationType)) {
            throw new RuntimeException(
                    "Unsupported personal operation: " +
                            operationType
            );
        }

        Person person =
                personRepository
                        .findById(
                                request.getCandidatePersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found: " +
                                                request.getCandidatePersonId()
                                )
                        );

        try {
            JsonNode data =
                    objectMapper.readTree(
                            request.getNewData()
                    );

            if (data.has("firstName")) {
                JsonNode value =
                        data.get("firstName");

                if (value.isNull() ||
                        value.asText()
                                .trim()
                                .isBlank()) {
                    throw new RuntimeException(
                            "First name cannot be blank"
                    );
                }

                person.setFirstName(
                        value.asText().trim()
                );
            }

            if (data.has("middleName")) {
                JsonNode value =
                        data.get("middleName");

                person.setMiddleName(
                        value.isNull()
                                ? null
                                : value.asText()
                                .trim()
                                .isBlank()
                                  ? null
                                  : value.asText().trim()
                );
            }

            if (data.has("lastName")) {
                JsonNode value =
                        data.get("lastName");

                person.setLastName(
                        value.isNull()
                                ? null
                                : value.asText()
                                .trim()
                                .isBlank()
                                  ? null
                                  : value.asText().trim()
                );
            }

            personRepository.save(person);

            if (data.has("alternateEmail")) {
                JsonNode value =
                        data.get("alternateEmail");

                String alternateEmail = null;

                if (value != null &&
                        !value.isNull() &&
                        !value.asText()
                                .trim()
                                .isBlank()) {

                    alternateEmail =
                            value.asText().trim();
                }

                saveOrUpdateContact(
                        person,
                        "ALTERNATE_EMAIL",
                        alternateEmail
                );
            }

            if (data.has("alternatePhone")) {
                JsonNode value =
                        data.get("alternatePhone");

                String alternatePhone = null;

                if (value != null &&
                        !value.isNull() &&
                        !value.asText()
                                .trim()
                                .isBlank()) {

                    alternatePhone =
                            value.asText().trim();
                }

                saveOrUpdateContact(
                        person,
                        "ALTERNATE_PHONE",
                        alternatePhone
                );
            }

        } catch (RuntimeException e) {
            throw e;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to apply personal profile change",
                    e
            );
        }
    }

    private void saveOrUpdateContact(
            Person person,
            String contactTypeName,
            String contactValue
    ) {
        ContactTypeMaster contactType =
                contactTypeMasterRepository
                        .findByContactTypeName(
                                contactTypeName
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        contactTypeName +
                                                " not found in contact type master"
                                )
                        );

        PersonContact contact =
                personContactRepository
                        .findByPersonAndContactType(
                                person,
                                contactType
                        )
                        .orElse(null);

        if (contactValue == null ||
                contactValue.isBlank()) {

            if (contact != null) {
                personContactRepository.delete(contact);
            }

            return;
        }

        if (contact != null) {
            contact.setContactValue(
                    contactValue.trim()
            );

            personContactRepository.save(contact);
            return;
        }

        PersonContact newContact =
                new PersonContact();

        newContact.setPerson(person);
        newContact.setContactType(contactType);
        newContact.setContactValue(
                contactValue.trim()
        );

        personContactRepository.save(newContact);
    }

    private void applyEducationChange(
            ProfileChangeRequest request,
            String operationType
    ) {
        Long personId =
                request.getCandidatePersonId();

        Person person =
                personRepository
                        .findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found: " +
                                                personId
                                )
                        );

        try {
            if ("ADD".equals(operationType)) {

                EducationRequest dto =
                        objectMapper.readValue(
                                request.getNewData(),
                                EducationRequest.class
                        );

                if (dto.getQualification() == null ||
                        dto.getQualification().isBlank()) {
                    throw new RuntimeException(
                            "Qualification is required"
                    );
                }

                Integer passingYear = null;

                if (dto.getPassingYear() != null &&
                        !dto.getPassingYear().isBlank()) {

                    try {
                        passingYear =
                                Integer.valueOf(
                                        dto.getPassingYear()
                                );
                    } catch (NumberFormatException e) {
                        throw new RuntimeException(
                                "Invalid passing year: " +
                                        dto.getPassingYear()
                        );
                    }
                }

                PersonEducation education =
                        PersonEducation.builder()
                                .person(person)
                                .qualification(
                                        dto.getQualification()
                                )
                                .instituteName(
                                        dto.getInstituteName()
                                )
                                .fieldOfStudy(
                                        dto.getFieldOfStudy()
                                )
                                .passingYear(
                                        passingYear
                                )
                                .build();

                educationRepository.save(
                        education
                );

                return;
            }

            if ("UPDATE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for education update"
                    );
                }

                PersonEducation education =
                        educationRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Education record not found"
                                        )
                                );

                checkOwner(
                        education.getPerson(),
                        personId
                );

                EducationRequest dto =
                        objectMapper.readValue(
                                request.getNewData(),
                                EducationRequest.class
                        );

                education.setQualification(
                        dto.getQualification()
                );

                education.setInstituteName(
                        dto.getInstituteName()
                );

                education.setFieldOfStudy(
                        dto.getFieldOfStudy()
                );

                Integer passingYear = null;

                if (dto.getPassingYear() != null &&
                        !dto.getPassingYear().isBlank()) {

                    passingYear =
                            Integer.valueOf(
                                    dto.getPassingYear()
                            );
                }

                education.setPassingYear(
                        passingYear
                );

                educationRepository.save(
                        education
                );

                return;
            }

            if ("DELETE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for education delete"
                    );
                }

                PersonEducation education =
                        educationRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Education record not found"
                                        )
                                );

                checkOwner(
                        education.getPerson(),
                        personId
                );

                educationRepository.delete(
                        education
                );

                return;
            }

            throw new RuntimeException(
                    "Unsupported education operation: " +
                            operationType
            );

        } catch (RuntimeException e) {
            throw e;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to apply education profile change",
                    e
            );
        }
    }

    private void applyExperienceChange(
            ProfileChangeRequest request,
            String operationType
    ) {
        Long personId =
                request.getCandidatePersonId();

        Person person =
                personRepository
                        .findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found: " +
                                                personId
                                )
                        );

        try {
            if ("ADD".equals(operationType)) {

                ExperienceRequest dto =
                        objectMapper.readValue(
                                request.getNewData(),
                                ExperienceRequest.class
                        );

                PersonWorkExperience experience =
                        PersonWorkExperience.builder()
                                .person(person)
                                .companyName(
                                        dto.getCompanyName()
                                )
                                .designation(
                                        dto.getDesignation()
                                )
                                .startDate(
                                        dto.getStartDate()
                                )
                                .endDate(
                                        dto.getEndDate()
                                )
                                .currentlyWorking(
                                        dto.getEndDate() == null
                                )
                                .build();

                experienceRepository.save(
                        experience
                );

                return;
            }

            if ("UPDATE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for experience update"
                    );
                }

                PersonWorkExperience experience =
                        experienceRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Experience record not found"
                                        )
                                );

                checkOwner(
                        experience.getPerson(),
                        personId
                );

                ExperienceRequest dto =
                        objectMapper.readValue(
                                request.getNewData(),
                                ExperienceRequest.class
                        );

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
                        dto.getEndDate() == null
                );

                experienceRepository.save(
                        experience
                );

                return;
            }

            if ("DELETE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for experience delete"
                    );
                }

                PersonWorkExperience experience =
                        experienceRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Experience record not found"
                                        )
                                );

                checkOwner(
                        experience.getPerson(),
                        personId
                );

                experienceRepository.delete(
                        experience
                );

                return;
            }

            throw new RuntimeException(
                    "Unsupported experience operation: " +
                            operationType
            );

        } catch (RuntimeException e) {
            throw e;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to apply experience profile change",
                    e
            );
        }
    }

    private void applyVisaChange(
            ProfileChangeRequest request,
            String operationType
    ) {
        Long personId =
                request.getCandidatePersonId();

        if (request.getTargetId() == null) {
            throw new RuntimeException(
                    "targetId is required for visa " +
                            operationType
            );
        }

        PersonVisa visa =
                visaRepository
                        .findById(
                                request.getTargetId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Visa record not found: " +
                                                request.getTargetId()
                                )
                        );

        checkOwner(
                visa.getPerson(),
                personId
        );

        if ("DELETE".equals(operationType)) {
            visaRepository.delete(visa);
            return;
        }

        if (!"UPDATE".equals(operationType)) {
            throw new RuntimeException(
                    "Unsupported visa operation: " +
                            operationType
            );
        }

        try {
            JsonNode data =
                    objectMapper.readTree(
                            request.getNewData()
                    );

            if (data.has("visaType")) {
                JsonNode value =
                        data.get("visaType");

                visa.setVisaType(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("eadType")) {
                JsonNode value =
                        data.get("eadType");

                visa.setEadType(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("visaExpiryDate")) {
                JsonNode value =
                        data.get("visaExpiryDate");

                if (value.isNull() ||
                        value.asText()
                                .trim()
                                .isBlank()) {

                    visa.setVisaExpiryDate(null);

                } else {
                    visa.setVisaExpiryDate(
                            LocalDate.parse(
                                    value.asText().trim()
                            )
                    );
                }
            }

            visaRepository.save(visa);

        } catch (RuntimeException e) {
            throw e;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to apply visa profile change",
                    e
            );
        }
    }

    private void checkOwner(
            Person person,
            Long personId
    ) {
        if (person == null ||
                person.getPersonId() == null ||
                !person.getPersonId().equals(personId)) {

            throw new RuntimeException(
                    "Requested record does not belong to person: " +
                            personId
            );
        }
    }

    private Long getAuthenticatedPersonId() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Authenticated user not found: " +
                                                username
                                )
                        );

        if (user.getPerson() == null) {
            throw new RuntimeException(
                    "Authenticated user is not linked to a person"
            );
        }

        return user.getPerson().getPersonId();
    }

    public boolean isOwner(
            Long candidatePersonId
    ) {
        if (candidatePersonId == null) {
            return false;
        }

        try {
            return candidatePersonId.equals(
                    getAuthenticatedPersonId()
            );

        } catch (RuntimeException e) {
            return false;
        }
    }

    private void validateTargetId(
            String requestType,
            String operationType,
            Long targetId
    ) {
        boolean requiresTarget =
                switch (requestType) {

                    case "EDUCATION",
                         "EXPERIENCE",
                         "WORK_EXPERIENCE",
                         "DOCUMENT",
                         "VISA" ->

                            "UPDATE".equals(operationType) ||
                                    "DELETE".equals(operationType);

                    default -> false;
                };

        if (requiresTarget &&
                targetId == null) {

            throw new IllegalArgumentException(
                    "targetId is required for " +
                            requestType + " " +
                            operationType
            );
        }
    }

    public ProfileChangeRequestDto toDto(
            ProfileChangeRequest request
    ) {
        Person person =
                personRepository
                        .findById(
                                request.getCandidatePersonId()
                        )
                        .orElse(null);

        return ProfileChangeRequestDto.builder()
                .requestId(request.getRequestId())
                .personId(
                        request.getCandidatePersonId()
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
                .requestType(
                        request.getRequestType()
                )
                .operationType(
                        request.getOperationType()
                )
                .targetId(
                        request.getTargetId()
                )
                .newData(
                        request.getNewData()
                )
                .status(
                        request.getStatus()
                )
                .rejectionReason(
                        request.getRejectionReason()
                )
                .build();
    }

    private void applyDocumentChange(
            ProfileChangeRequest request,
            String operationType
    ) {

        Long personId =
                request.getCandidatePersonId();

        Person person =
                personRepository
                        .findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found: " +
                                                personId
                                )
                        );

        try {

            // =====================================================
            // ADD DOCUMENT
            // =====================================================

            if ("ADD".equals(operationType)) {

                JsonNode data =
                        objectMapper.readTree(
                                request.getNewData()
                        );

                String documentType =
                        data.has("documentType") &&
                                !data.get("documentType").isNull()
                                ? data.get("documentType")
                                  .asText()
                                  .trim()
                                : null;

                if (documentType == null ||
                        documentType.isBlank()) {

                    throw new RuntimeException(
                            "Document type is required"
                    );
                }

                String documentNumber =
                        data.has("documentNumber") &&
                                !data.get("documentNumber").isNull()
                                ? data.get("documentNumber")
                                  .asText()
                                  .trim()
                                : null;

                String fileName =
                        data.has("fileName") &&
                                !data.get("fileName").isNull()
                                ? data.get("fileName")
                                  .asText()
                                  .trim()
                                : null;

                String contentType =
                        data.has("contentType") &&
                                !data.get("contentType").isNull()
                                ? data.get("contentType")
                                  .asText()
                                  .trim()
                                : null;

                Long fileSize = null;

                if (data.has("fileSize") &&
                        !data.get("fileSize").isNull()) {

                    fileSize =
                            data.get("fileSize")
                                    .asLong();
                }

                byte[] fileData = null;

                if (data.has("fileData") &&
                        !data.get("fileData").isNull()) {

                    String base64File =
                            data.get("fileData").asText();

                    if (!base64File.isBlank()) {
                        fileData =
                                java.util.Base64
                                        .getDecoder()
                                        .decode(base64File);
                    }
                }

                PersonDocument document =
                        PersonDocument.builder()
                                .person(person)
                                .documentType(documentType)
                                .documentNumber(documentNumber)
                                .fileName(fileName)
                                .fileData(fileData)
                                .contentType(contentType)
                                .fileSize(fileSize)
                                .build();

                documentRepository.save(document);

                return;
            }

            // =====================================================
            // UPDATE DOCUMENT
            // =====================================================

            if ("UPDATE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for document update"
                    );
                }

                PersonDocument document =
                        documentRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Document record not found"
                                        )
                                );

                checkOwner(
                        document.getPerson(),
                        personId
                );

                JsonNode data =
                        objectMapper.readTree(
                                request.getNewData()
                        );

                if (data.has("documentType") &&
                        !data.get("documentType").isNull()) {

                    document.setDocumentType(
                            data.get("documentType")
                                    .asText()
                                    .trim()
                    );
                }

                if (data.has("documentNumber")) {

                    JsonNode value =
                            data.get("documentNumber");

                    document.setDocumentNumber(
                            value.isNull()
                                    ? null
                                    : value.asText().trim()
                    );
                }

                if (data.has("fileName")) {

                    JsonNode value =
                            data.get("fileName");

                    document.setFileName(
                            value.isNull()
                                    ? null
                                    : value.asText().trim()
                    );
                }

                if (data.has("contentType")) {

                    JsonNode value =
                            data.get("contentType");

                    document.setContentType(
                            value.isNull()
                                    ? null
                                    : value.asText().trim()
                    );
                }

                if (data.has("fileSize") &&
                        !data.get("fileSize").isNull()) {

                    document.setFileSize(
                            data.get("fileSize").asLong()
                    );
                }

                if (data.has("fileData") &&
                        !data.get("fileData").isNull()) {

                    String base64File =
                            data.get("fileData").asText();

                    if (!base64File.isBlank()) {

                        document.setFileData(
                                java.util.Base64
                                        .getDecoder()
                                        .decode(base64File)
                        );
                    }
                }

                documentRepository.save(document);

                return;
            }

            // =====================================================
            // DELETE DOCUMENT
            // =====================================================

            if ("DELETE".equals(operationType)) {

                if (request.getTargetId() == null) {
                    throw new RuntimeException(
                            "targetId is required for document delete"
                    );
                }

                PersonDocument document =
                        documentRepository
                                .findById(
                                        request.getTargetId()
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Document record not found"
                                        )
                                );

                checkOwner(
                        document.getPerson(),
                        personId
                );

                documentRepository.delete(document);

                return;
            }

            throw new RuntimeException(
                    "Unsupported document operation: " +
                            operationType
            );

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to apply document profile change",
                    e
            );
        }
    }

    private void applyAddressChange(
            ProfileChangeRequest request,
            String operationType
    ) {

        if (!"UPDATE".equals(operationType)) {
            throw new RuntimeException(
                    "Unsupported address operation: " +
                            operationType
            );
        }

        Long personId =
                request.getCandidatePersonId();

        Person person =
                personRepository
                        .findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found: " +
                                                personId
                                )
                        );

        try {

            JsonNode data =
                    objectMapper.readTree(
                            request.getNewData()
                    );

            List<PersonAddress> addresses =
                    personAddressRepository
                            .findByPersonPersonId(
                                    personId
                            );

            PersonAddress address;

            if (addresses.isEmpty()) {
                address = new PersonAddress();
                address.setPerson(person);
            } else {
                address = addresses.get(0);
            }

            if (data.has("addressLine")) {
                JsonNode value =
                        data.get("addressLine");

                address.setAddressLine1(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("city")) {
                JsonNode value =
                        data.get("city");

                address.setCity(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("state")) {
                JsonNode value =
                        data.get("state");

                address.setState(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("country")) {
                JsonNode value =
                        data.get("country");

                address.setCountry(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            if (data.has("zipcode")) {
                JsonNode value =
                        data.get("zipcode");

                address.setZipcode(
                        value.isNull()
                                ? null
                                : value.asText().trim()
                );
            }

            personAddressRepository.save(address);

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to apply address profile change",
                    e
            );
        }
    }
}