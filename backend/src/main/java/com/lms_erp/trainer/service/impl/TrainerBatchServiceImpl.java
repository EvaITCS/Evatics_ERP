package com.lms_erp.trainer.service.impl;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.batch.repository.BatchRepository;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonAddress;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.entity.PersonEducation;
import com.lms_erp.person.repository.PersonAddressRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonEducationRepository;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.trainer.dto.TrainerBatchDetailsResponse;
import com.lms_erp.trainer.dto.TrainerBatchPageResponse;
import com.lms_erp.trainer.dto.TrainerBatchResponse;
import com.lms_erp.trainer.dto.TrainerBatchStudentResponse;
import com.lms_erp.trainer.dto.TrainerBatchSummaryResponse;
import com.lms_erp.trainer.repository.TrainerBatchRepository;
import com.lms_erp.trainer.service.TrainerBatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerBatchServiceImpl implements TrainerBatchService {

    private final TrainerBatchRepository repository;

    private final EmployeeRepository employeeRepository;

    private final StudentBatchRepository studentBatchRepository;
    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationStageRepository applicationStageRepository;

    private final BatchRepository batchRepository;

    // Core person repositories
    private final PersonAddressRepository personAddressRepository;
    private final PersonContactRepository personContactRepository;
    private final PersonEducationRepository personEducationRepository;


    // =========================================================
    // TRAINER BATCHES
    // =========================================================

    @Override
    public List<TrainerBatchResponse> getTrainerBatches(Long userId) {

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for userId: " + userId));

        return repository.getTrainerBatches(employee.getPersonId());
    }
    private void setBatchStatus(
            TrainerBatchResponse response,
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate == null || endDate == null) {

            response.setBatchStatus("");

        } else if (LocalDate.now().isBefore(startDate)) {

            response.setBatchStatus("UPCOMING");

        } else if (LocalDate.now().isAfter(endDate)) {

            response.setBatchStatus("COMPLETED");

        } else {

            response.setBatchStatus("ONGOING");
        }
    }

    // =========================================================
    // TRAINER BATCHES WITH STATUS
    // =========================================================

    @Override
    public List<TrainerBatchResponse> getTrainerBatchesByUserId(Long userId) {

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for userId: " + userId));

        List<TrainerBatchResponse> batches =
                repository.getTrainerBatches(employee.getPersonId());

        LocalDate today = LocalDate.now();

        for (TrainerBatchResponse batch : batches) {

            Batch entity = batchRepository.findById(batch.getBatchId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Batch not found: " + batch.getBatchId()
                            )
                    );

            setBatchStatus(
                    batch,
                    entity.getStartDate(),
                    entity.getEndDate()
            );
        }

        return batches;
    }


    // =========================================================
    // MY BATCH DETAILS
    // =========================================================

    @Override
    public List<TrainerBatchDetailsResponse> getMyBatchDetails(Long userId) {

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for userId: " + userId));

        return repository.getAllTrainerBatchDetails(
                employee.getPersonId()
        );
    }


    // =========================================================
    // BATCH SUMMARY
    // =========================================================

    @Override
    public List<TrainerBatchSummaryResponse> getBatchSummary(Long userId) {

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for userId: " + userId));

        return repository.getBatchSummary(
                employee.getPersonId()
        );
    }


    // =========================================================
    // TRAINER BATCH PAGE
    // =========================================================

    @Override
    public List<TrainerBatchPageResponse> getTrainerBatchPage(Long userId) {

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found for userId: " + userId));

        List<TrainerBatchPageResponse> batches =
                repository.findTrainerBatchPage(
                        employee.getPersonId()
                );

        for (TrainerBatchPageResponse batch : batches) {

            setBatchPageStatus(
                    batch,
                    batch.getStartDate(),
                    batch.getEndDate()
            );
        }

        return batches;
    }

    @Override
    @Transactional
    public void dropStudent(
            Long studentBatchId,
            String reason
    ) {

        StudentBatch studentBatch =
                studentBatchRepository.findById(studentBatchId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found in batch"
                                )
                        );

        // =====================================================
        // DROPPED STAGE
        // =====================================================

        ApplicationStageMaster droppedStage =
                applicationStageRepository
                        .findByApplicationStageName("DROPPED")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "DROPPED stage not found"
                                )
                        );

        // =====================================================
        // IMPORTANT:
        // Update BATCH student status
        // NOT StudentApplication global status
        // =====================================================

        studentBatch.setApplicationStage(droppedStage);

        studentBatch.setDroppedDate(
                LocalDate.now()
        );

        studentBatch.setDropReason(
                reason
        );

        studentBatchRepository.save(
                studentBatch
        );

        // =====================================================
        // DECREASE CURRENT BATCH STRENGTH
        // =====================================================

        Batch batch =
                studentBatch.getBatch();

        if (batch != null &&
                batch.getCurrentStrength() != null &&
                batch.getCurrentStrength() > 0) {

            batch.setCurrentStrength(
                    batch.getCurrentStrength() - 1
            );

            batchRepository.save(batch);
        }
    }



    private void setBatchPageStatus(
            TrainerBatchPageResponse response,
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (startDate == null || endDate == null) {

            response.setBatchStatus("");

        } else if (LocalDate.now().isBefore(startDate)) {

            response.setBatchStatus("UPCOMING");

        } else if (LocalDate.now().isAfter(endDate)) {

            response.setBatchStatus("COMPLETED");

        } else {

            response.setBatchStatus("ONGOING");
        }
    }


    // =========================================================
    // CONTACT HELPER
    // =========================================================

    private String getContactValue(
            List<PersonContact> contacts,
            String contactType
    ) {

        if (contacts == null || contacts.isEmpty()) {
            return "";
        }

        return contacts.stream()

                .filter(contact ->
                        contact.getContactType() != null
                                && contactType.equalsIgnoreCase(
                                contact.getContactType()
                                        .getContactTypeName()
                        )
                )

                .map(PersonContact::getContactValue)

                .filter(value ->
                        value != null && !value.isBlank()
                )

                .findFirst()

                .orElse("");
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainerBatchStudentResponse> getBatchStudents(
            Long batchId,
            String type
    ) {

        List<StudentBatch> studentBatches =
                studentBatchRepository.findByBatchBatchId(batchId);

        return studentBatches.stream()

                // =====================================================
                // FILTER USING STUDENT BATCH STAGE
                // =====================================================
                .filter(sb -> {

                    ApplicationStageMaster batchStage =
                            sb.getApplicationStage();

                    if (batchStage == null) {
                        return false;
                    }

                    String stage =
                            batchStage.getApplicationStageName();

                    if (type == null || "ALL".equalsIgnoreCase(type)) {
                        return true;
                    }

                    if ("ENROLLED".equalsIgnoreCase(type)) {
                        return "ENROLLED".equalsIgnoreCase(stage);
                    }

                    if ("GRADUATED".equalsIgnoreCase(type)) {
                        return "COURSE_COMPLETED".equalsIgnoreCase(stage);
                    }

                    if ("DROPPED".equalsIgnoreCase(type)) {
                        return "DROPPED".equalsIgnoreCase(stage);
                    }

                    return false;
                })

                // =====================================================
                // MAP STUDENTS
                // =====================================================
                .map(sb -> {

                    StudentApplication application =
                            sb.getStudentApplication();

                    Person person =
                            application != null
                                    ? application.getPerson()
                                    : null;

                    // =================================================
                    // PERSON
                    // =================================================

                    Long personId = null;

                    String firstName = "";
                    String lastName = "";

                    if (person != null) {

                        personId = person.getPersonId();

                        firstName =
                                person.getFirstName() != null
                                        ? person.getFirstName()
                                        : "";

                        lastName =
                                person.getLastName() != null
                                        ? person.getLastName()
                                        : "";
                    }

                    // =================================================
                    // ADDRESS
                    // =================================================

                    String city = "";
                    String state = "";

                    if (person != null) {

                        List<PersonAddress> addresses =
                                personAddressRepository
                                        .findByPersonPersonId(
                                                person.getPersonId()
                                        );

                        if (!addresses.isEmpty()) {

                            PersonAddress address =
                                    addresses.get(0);

                            city =
                                    address.getCity() != null
                                            ? address.getCity()
                                            : "";

                            state =
                                    address.getState() != null
                                            ? address.getState()
                                            : "";
                        }
                    }

                    // =================================================
                    // EDUCATION
                    // =================================================

                    String education = "";

                    if (person != null) {

                        List<PersonEducation> educations =
                                personEducationRepository
                                        .findByPersonPersonId(
                                                person.getPersonId()
                                        );

                        if (!educations.isEmpty()) {

                            PersonEducation latestEducation =
                                    educations.get(
                                            educations.size() - 1
                                    );

                            education =
                                    latestEducation.getQualification() != null
                                            ? latestEducation.getQualification()
                                            : "";
                        }
                    }

                    // =================================================
                    // CONTACT
                    // =================================================

                    String phone = "";
                    String email = "";

                    if (person != null) {

                        List<PersonContact> contacts =
                                personContactRepository
                                        .findByPersonPersonId(
                                                person.getPersonId()
                                        );

                        email =
                                getContactValue(
                                        contacts,
                                        "PRIMARY_EMAIL"
                                );

                        phone =
                                getContactValue(
                                        contacts,
                                        "PRIMARY_PHONE"
                                );
                    }

                    // =================================================
                    // PROGRAM
                    // =================================================

                    String programName = "";

                    if (sb.getBatch() != null &&
                            sb.getBatch().getProgram() != null) {

                        programName =
                                sb.getBatch()
                                        .getProgram()
                                        .getProgramName();
                    }

                    // =================================================
                    // BATCH APPLICATION STAGE
                    // IMPORTANT
                    // =================================================

                    String applicationStage = "";

                    if (sb.getApplicationStage() != null) {

                        applicationStage =
                                sb.getApplicationStage()
                                        .getApplicationStageName();
                    }

                    // =================================================
                    // RESPONSE
                    // =================================================

                    return TrainerBatchStudentResponse.builder()

                            .studentBatchId(
                                    sb.getStudentBatchId()
                            )

                            .studentPersonId(
                                    personId
                            )

                            .studentName(
                                    (firstName + " " + lastName).trim()
                            )

                            .phone(phone)

                            .email(email)

                            .city(city)

                            .state(state)

                            .highestEducation(education)

                            .programName(programName)

                            .applicationStage(
                                    applicationStage
                            )

                            .completedDate(
                                    sb.getCompletedDate()
                            )

                            .droppedDate(
                                    sb.getDroppedDate()
                            )

                            .dropReason(
                                    sb.getDropReason()
                            )

                            .build();
                })

                .toList();
    }
}