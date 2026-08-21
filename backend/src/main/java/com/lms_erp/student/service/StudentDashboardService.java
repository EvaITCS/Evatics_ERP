package com.lms_erp.student.service;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.student.dto.MyBatchResponse;
import com.lms_erp.student.dto.StudentDashboardResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.enums.StudentDashboardType;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final PersonContactRepository personContactRepository;
    private final StudentBatchRepository studentBatchRepository;
    private final StudentApplicationRepository studentApplicationRepository;

    @Transactional(readOnly = true)
    public MyBatchResponse getMyBatch(String email) {

        Person person = findPersonByEmail(email);

        StudentApplication application = studentApplicationRepository
                .findByPerson(person)
                .orElseThrow(() -> new RuntimeException("Student Application not found"));

        StudentBatch studentBatch = studentBatchRepository
                .findTopByStudentApplicationOrderByAssignedDateDesc(application)
                .orElseThrow(() -> new RuntimeException("No Batch Assigned"));

        Batch batch = studentBatch.getBatch();

        return new MyBatchResponse(
                batch.getBatchId(),
                batch.getBatchCode(),
                batch.getBatchName(),
                batch.getProgram() != null
                        ? batch.getProgram().getProgramName()
                        : null,
                (batch.getTrainer() != null && batch.getTrainer().getPerson() != null)
                        ? batch.getTrainer().getPerson().getFirstName()
                          + " "
                          + batch.getTrainer().getPerson().getLastName()
                        : null,
                batch.getBatchStatus() != null
                        ? batch.getBatchStatus().getBatchStatusName()
                        : null,
                batch.getStartDate() != null
                        ? batch.getStartDate().toString()
                        : null,

                batch.getEndDate() != null
                        ? batch.getEndDate().toString()
                        : null,
                (int) ChronoUnit.DAYS.between(
                        batch.getStartDate(),
                        batch.getEndDate()
                )
        );
    }

    @Transactional(readOnly = true)
    public StudentDashboardResponse resolve(String email) {

        Person person = findPersonByEmail(email);

        StudentApplication application = studentApplicationRepository
                .findByPerson(person)
                .orElseThrow(() -> new RuntimeException("Student Application not found"));

        StudentDashboardResponse response = new StudentDashboardResponse();

        // Person ID
        response.setPersonId(application.getPersonId());

        // Full Name
        Person p = application.getPerson();

        if (p == null) {
            throw new RuntimeException("Person not found");
        }

        String firstName = p.getFirstName() == null ? "" : p.getFirstName().trim();
        String middleName = p.getMiddleName() == null ? "" : p.getMiddleName().trim();
        String lastName = p.getLastName() == null ? "" : p.getLastName().trim();

        String fullName = (firstName + " " + middleName + " " + lastName)
                .replaceAll("\\s+", " ")
                .trim();

        response.setName(fullName);
        response.setEmail(getEmail(p));

        // Submitted Date
        if (application.getCreatedAt() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            response.setSubmittedOn(application.getCreatedAt().format(formatter));
        }

        // Current Stage Mapping
        if (application.getApplicationStage() != null) {

            response.setApplicationStageId(
                    application.getApplicationStage().getApplicationStageId()
            );

            response.setCurrentStage(
                    application.getApplicationStage().getApplicationStageName()
            );
        }

        // Enrollment Check
        boolean enrolled = studentBatchRepository
                .existsByStudentApplicationPersonPersonId(application.getPersonId());

        if (!enrolled) {

            response.setDashboardType(StudentDashboardType.BASIC);

        } else {

            StudentBatch studentBatch = studentBatchRepository
                    .findTopByStudentApplicationOrderByAssignedDateDesc(application)
                    .orElse(null);

            if (studentBatch != null) {

                // Batch Start Date
                if (studentBatch.getBatch().getStartDate() != null) {

                    LocalDate startDate = studentBatch.getBatch().getStartDate();

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

                    // UI Display
                    response.setBatchStartDate(startDate.format(formatter));

                    // Countdown / JS Date
                    response.setBatchStartDateIso(startDate);
                }

                // Program Name
                if (studentBatch.getBatch().getProgram() != null) {
                    response.setProgram(
                            studentBatch.getBatch().getProgram().getProgramName()
                    );
                } else {
                    response.setProgram("N/A");
                }

                // Dashboard Type Mapping
                LocalDate today = LocalDate.now();
                LocalDate batchStartDate = studentBatch.getBatch().getStartDate();

                if (today.isBefore(batchStartDate)) {
                    response.setDashboardType(StudentDashboardType.WAITING_BATCH);
                } else {
                    response.setDashboardType(StudentDashboardType.TRAINING);
                }

            } else {
                response.setDashboardType(StudentDashboardType.WAITING_BATCH);
            }
        }

        return response;
    }

    private Person findPersonByEmail(String email) {

        PersonContact contact = personContactRepository
                .findByContactValue(email)
                .orElseThrow(() -> new RuntimeException("Person not found"));

        return contact.getPerson();
    }

    /**
     * Helper to retrieve primary/alternate email via direct repository fetch.
     * Prevents LazyInitializationException on person.getContacts().
     */
    private String getEmail(Person person) {

        if (person == null) {
            return "";
        }

        return personContactRepository
                .findByPersonPersonId(person.getPersonId())
                .stream()
                .filter(c -> c.getContactType() != null &&
                        ("PRIMARY_EMAIL".equalsIgnoreCase(c.getContactType().getContactTypeName()) ||
                                "ALTERNATE_EMAIL".equalsIgnoreCase(c.getContactType().getContactTypeName())))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }
}