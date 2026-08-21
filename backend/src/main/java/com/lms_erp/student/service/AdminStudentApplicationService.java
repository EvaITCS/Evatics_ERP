package com.lms_erp.student.service;

import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonAddress;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.entity.PersonDocument;
import com.lms_erp.person.entity.PersonEducation;
import com.lms_erp.person.entity.PersonVisa;
import com.lms_erp.person.entity.PersonWorkExperience;
import com.lms_erp.person.repository.PersonAddressRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonDocumentRepository;
import com.lms_erp.person.repository.PersonEducationRepository;
import com.lms_erp.person.repository.PersonVisaRepository;
import com.lms_erp.person.repository.PersonWorkExperienceRepository;
import com.lms_erp.student.dto.AdminApplicationListResponse;
import com.lms_erp.student.dto.EducationRequest;
import com.lms_erp.student.dto.ExperienceRequest;
import com.lms_erp.student.dto.StudentApplicationResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.invitation.ApplicationInvitationTokenRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminStudentApplicationService {

    private final StudentApplicationRepository studentApplicationRepository;
    private final PersonAddressRepository personAddressRepository;
    private final PersonVisaRepository personVisaRepository;
    private final PersonEducationRepository personEducationRepository;
    private final PersonWorkExperienceRepository personWorkExperienceRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final PersonContactRepository personContactRepository;
    private final ApplicationInvitationTokenRepository invitationTokenRepository;

    private static final String DOC_RESUME = "Resume";
    private static final String DOC_ID_PROOF = "ID Proof";
    private static final String DOC_TRANSCRIPT = "Transcript";

    // ==========================================================
    // GET STUDENT PROFILE
    // ==========================================================

    @Transactional(readOnly = true)
    public StudentApplicationResponse getStudentProfile(Long personId) {

        log.info(
                "Fetching integrated core tables profile for personId: {}",
                personId
        );

        StudentApplication application =
                studentApplicationRepository
                        .findByPersonPersonId(personId)
                        .orElseThrow(() ->
                                new RuntimeException("Application Not Found"));

        Person person = application.getPerson();

        boolean invitationSent =
                invitationTokenRepository
                        .findTopByStudentApplicationOrderByCreatedAtDesc(application)
                        .isPresent();

        // ======================================================
        // CONTACTS
        // ======================================================

        List<PersonContact> contacts =
                personContactRepository
                        .findByPersonPersonId(person.getPersonId());

        // ======================================================
        // ADDRESS
        // ======================================================

        List<PersonAddress> addresses =
                personAddressRepository
                        .findByPersonPersonId(person.getPersonId());

        PersonAddress address =
                addresses.isEmpty()
                        ? null
                        : addresses.get(0);

        // ======================================================
        // VISA
        // ======================================================

        List<PersonVisa> visas =
                personVisaRepository
                        .findByPersonPersonId(person.getPersonId());

        PersonVisa visa =
                visas.isEmpty()
                        ? null
                        : visas.get(0);

        // ======================================================
        // EDUCATION
        // ======================================================

        List<PersonEducation> eduEntities =
                personEducationRepository
                        .findByPersonPersonId(person.getPersonId());

        List<EducationRequest> eduList =
                new ArrayList<>();

        for (PersonEducation edu : eduEntities) {

            EducationRequest eduDto =
                    new EducationRequest();

            eduDto.setInstituteName(
                    edu.getInstituteName()
            );

            eduDto.setQualification(
                    edu.getQualification()
            );

            eduDto.setFieldOfStudy(
                    edu.getFieldOfStudy()
            );

            if (edu.getPassingYear() != null) {

                eduDto.setPassingYear(
                        String.valueOf(
                                edu.getPassingYear()
                        )
                );
            }

            eduList.add(eduDto);
        }

        // ======================================================
        // EXPERIENCE
        // ======================================================

        List<PersonWorkExperience> expEntities =
                personWorkExperienceRepository
                        .findByPersonPersonId(person.getPersonId());

        List<ExperienceRequest> expList =
                new ArrayList<>();

        for (PersonWorkExperience exp : expEntities) {

            ExperienceRequest expDto =
                    new ExperienceRequest();

            // Company
            expDto.setCompanyName(
                    exp.getCompanyName()
            );

            // Designation
            expDto.setDesignation(
                    exp.getDesignation()
            );

            // Start Date
            expDto.setStartDate(
                    exp.getStartDate()
            );

            // End Date
            expDto.setEndDate(
                    exp.getEndDate()
            );



            expList.add(expDto);
        }
        // ======================================================
        // DOCUMENTS
        // ======================================================

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

            String documentName = doc.getDocumentType();

            String documentUrl =
                    "/api/person-documents/"
                            + doc.getPersonDocumentId()
                            + "/file";

            if (DOC_RESUME.equals(documentName)) {

                resumeUrl = documentUrl;

            } else if (DOC_TRANSCRIPT.equals(documentName)) {

                transcriptUrl = documentUrl;

            } else if (DOC_ID_PROOF.equals(documentName)) {

                idProofUrl = documentUrl;
            }
        }
        // ======================================================
        // FINAL RESPONSE
        // ======================================================

        return StudentApplicationResponse.builder()

                .personId(person.getPersonId())

                .firstName(person.getFirstName())
                .middleName(person.getMiddleName())
                .lastName(person.getLastName())

                // Contacts
                .email(
                        getContactValue(
                                contacts,
                                "PRIMARY_EMAIL",
                                "ALTERNATE_EMAIL"
                        )
                )

                .phone(
                        getContactValue(
                                contacts,
                                "PRIMARY_PHONE",
                                "ALTERNATE_PHONE"
                        )
                )

                .alternatePhone(
                        getContactValue(
                                contacts,
                                "ALTERNATE_PHONE",
                                null
                        )
                )

                .alternateEmail(
                        getContactValue(
                                contacts,
                                "ALTERNATE_EMAIL",
                                null
                        )
                )

                // ==================================================
                // ADDRESS
                // ==================================================

                .addressLine(
                        address != null
                                ? address.getAddressLine1()
                                : null
                )

                .city(
                        address != null
                                ? address.getCity()
                                : null
                )

                .state(
                        address != null
                                ? address.getState()
                                : null
                )

                .country(
                        address != null
                                ? address.getCountry()
                                : null
                )

                .zipcode(
                        address != null
                                ? address.getZipcode()
                                : null
                )

                // ==================================================
                // VISA
                // ==================================================

                .visaType(
                        visa != null
                                ? visa.getVisaType()
                                : null
                )

                .eadType(
                        visa != null
                                ? visa.getEadType()
                                : null
                )

                .visaExpiryDate(
                        visa != null
                                ? visa.getVisaExpiryDate()
                                : null
                )

                // ==================================================
                // DOCUMENTS
                // ==================================================

                .resume(resumeUrl)
                .transcript(transcriptUrl)
                .idProof(idProofUrl)

                // ==================================================
                // APPLICATION
                // ==================================================

                .applicationStage(
                        application.getApplicationStage() != null
                                ? application
                                  .getApplicationStage()
                                  .getApplicationStageName()
                                : null
                )

                .appliedDate(
                        application.getAppliedDate()
                )

                .admissionDate(
                        application.getAdmissionDate()
                )

                .invitationSent(invitationSent)

                .recheckReason(
                        application.getRecheckReason()
                )

                .educations(eduList)
                .experiences(expList)

                .build();
    }

    // ==========================================================
    // GET ALL SUBMITTED APPLICATIONS
    // ==========================================================

    @Transactional(readOnly = true)
    public List<AdminApplicationListResponse> getAllApplications() {

        List<StudentApplication> applications =
                studentApplicationRepository
                        .findByApplicationStageApplicationStageName(
                                "SUBMITTED"
                        );

        List<AdminApplicationListResponse> response =
                new ArrayList<>();

        for (StudentApplication app : applications) {

            Person person = app.getPerson();

            if (person == null) {
                continue;
            }

            List<PersonContact> contacts =
                    personContactRepository
                            .findByPersonPersonId(
                                    person.getPersonId()
                            );

            AdminApplicationListResponse dto =
                    new AdminApplicationListResponse();

            dto.setPersonId(
                    person.getPersonId()
            );

            dto.setFirstName(
                    person.getFirstName()
            );

            dto.setMiddleName(
                    person.getMiddleName()
            );

            dto.setLastName(
                    person.getLastName()
            );

            dto.setEmail(
                    getContactValue(
                            contacts,
                            "PRIMARY_EMAIL",
                            "ALTERNATE_EMAIL"
                    )
            );

            dto.setApplicationStage(
                    app.getApplicationStage() != null
                            ? app.getApplicationStage()
                              .getApplicationStageName()
                            : null
            );

            dto.setBatchName(null);

            response.add(dto);
        }

        return response;
    }

    // ==========================================================
    // CONTACT HELPER
    // ==========================================================

    private String getContactValue(
            List<PersonContact> contacts,
            String primaryType,
            String fallbackType
    ) {

        if (contacts == null || contacts.isEmpty()) {
            return null;
        }

        // Primary contact
        String primaryValue =
                contacts.stream()
                        .filter(c ->
                                c.getContactType() != null
                                        && primaryType.equalsIgnoreCase(
                                        c.getContactType()
                                                .getContactTypeName()
                                )
                        )
                        .map(PersonContact::getContactValue)
                        .findFirst()
                        .orElse(null);

        if (primaryValue != null) {
            return primaryValue;
        }

        // Fallback contact
        if (fallbackType != null) {

            return contacts.stream()
                    .filter(c ->
                            c.getContactType() != null
                                    && fallbackType.equalsIgnoreCase(
                                    c.getContactType()
                                            .getContactTypeName()
                            )
                    )
                    .map(PersonContact::getContactValue)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}