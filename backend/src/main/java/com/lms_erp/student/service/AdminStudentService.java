package com.lms_erp.student.service;

import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.student.dto.AdminStudentResponse;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStudentService {

    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationStageRepository applicationStageRepository;
    private final StudentBatchRepository studentBatchRepository;
    private final PersonContactRepository personContactRepository;

    public List<AdminStudentResponse> getAllEnrolledStudents() {

        ApplicationStageMaster enrolledStage =
                applicationStageRepository
                        .findByApplicationStageName("ENROLLED")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "ENROLLED stage not found"
                                )
                        );

        List<StudentApplication> applications =
                studentApplicationRepository
                        .findByApplicationStage(enrolledStage);

        return applications.stream()
                .map(application -> {

                    AdminStudentResponse dto =
                            new AdminStudentResponse();

                    // =================================================
                    // PERSON ID
                    // =================================================

                    dto.setPersonId(
                            application.getPersonId()
                    );

                    // =================================================
                    // APPLICATION STAGE
                    // =================================================

                    if (application.getApplicationStage() != null) {

                        dto.setApplicationStageId(
                                application
                                        .getApplicationStage()
                                        .getApplicationStageId()
                        );

                        dto.setApplicationStage(
                                application
                                        .getApplicationStage()
                                        .getApplicationStageName()
                        );

                        dto.setAdmissionDate(
                                application.getAdmissionDate()
                        );
                    }

                    // =================================================
                    // STUDENT DETAILS
                    // =================================================

                    if (application.getPerson() != null) {

                        String firstName =
                                application.getPerson().getFirstName() == null
                                        ? ""
                                        : application.getPerson().getFirstName().trim();

                        String middleName =
                                application.getPerson().getMiddleName() == null
                                        ? ""
                                        : application.getPerson().getMiddleName().trim();

                        String lastName =
                                application.getPerson().getLastName() == null
                                        ? ""
                                        : application.getPerson().getLastName().trim();



                        String fullName =
                                (firstName + " " + middleName + " " + lastName)
                                        .replaceAll("\\s+", " ")
                                        .trim();

                        dto.setStudentName(fullName);

                        dto.setEmail(
                                getEmail(
                                        application.getPersonId()
                                )
                        );

                    } else {

                        dto.setStudentName("Unknown");
                        dto.setEmail("N/A");
                    }

                    // =================================================
                    // BATCH
                    // =================================================

                    studentBatchRepository
                            .findByStudentApplicationPersonPersonId(
                                    application.getPersonId()
                            )
                            .ifPresent(studentBatch -> {

                                if (studentBatch.getBatch() != null) {

                                    dto.setBatchName(
                                            studentBatch
                                                    .getBatch()
                                                    .getBatchName()
                                    );
                                }
                            });

                    // =================================================
                    // DEFAULT STATUS
                    // =================================================

                    return dto;

                })
                .collect(Collectors.toList());
    }

    // =============================================================
    // GET EMAIL
    // =============================================================

    private String getEmail(Long personId) {

        if (personId == null) {
            return "N/A";
        }

        List<PersonContact> contacts =
                personContactRepository
                        .findByPersonPersonId(personId);

        return contacts.stream()

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        "PRIMARY_EMAIL".equalsIgnoreCase(
                                contact.getContactType()
                                        .getContactTypeName()
                        )
                )

                .map(PersonContact::getContactValue)

                .findFirst()

                .orElse("N/A");
    }
}
