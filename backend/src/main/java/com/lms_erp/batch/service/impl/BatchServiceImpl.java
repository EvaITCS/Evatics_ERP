package com.lms_erp.batch.service.impl;

import com.lms_erp.batch.dto.*;
import com.lms_erp.batch.entity.Batch;
import com.lms_erp.batch.entity.BatchStatusMaster;
import com.lms_erp.batch.repository.BatchRepository;
import com.lms_erp.batch.repository.BatchStatusRepository;
import com.lms_erp.batch.service.BatchService;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;

import com.lms_erp.program.entity.Program;
import com.lms_erp.program.repository.ProgramRepository;

import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.StudentBatchRepository;

import com.lms_erp.trainer.dto.TrainerDropdownResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final StudentBatchRepository studentBatchRepository;

    private final BatchRepository batchRepository;

    private final ProgramRepository programRepository;

    private final EmployeeRepository employeeRepository;

    private final BatchStatusRepository batchStatusRepository;


    // =====================================================
    // CREATE BATCH
    // =====================================================

    @Override
    public BatchResponse createBatch(
            BatchCreateRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Batch request cannot be null"
            );
        }

        if (request.getProgramId() == null) {
            throw new IllegalArgumentException(
                    "Program ID is required"
            );
        }

        if (request.getPersonId() == null) {
            throw new IllegalArgumentException(
                    "Trainer person ID is required"
            );
        }

        if (request.getBatchStatusId() == null) {
            throw new IllegalArgumentException(
                    "Batch status ID is required"
            );
        }

        if (request.getStartDate() == null) {
            throw new IllegalArgumentException(
                    "Start date is required"
            );
        }

        if (request.getEndDate() == null) {
            throw new IllegalArgumentException(
                    "End date is required"
            );
        }

        if (request.getEndDate().isBefore(
                request.getStartDate()
        )) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }

        if (request.getMinStudents() == null) {
            throw new IllegalArgumentException(
                    "Minimum students is required"
            );
        }

        if (request.getMaxStudents() == null) {
            throw new IllegalArgumentException(
                    "Maximum students is required"
            );
        }

        if (request.getMaxStudents()
                < request.getMinStudents()) {

            throw new IllegalArgumentException(
                    "Max students cannot be less than min students"
            );
        }


        System.out.println(
                "ProgramId = " + request.getProgramId()
        );

        System.out.println(
                "PersonId = " + request.getPersonId()
        );

        System.out.println(
                "BatchStatusId = " +
                        request.getBatchStatusId()
        );


        // =================================================
        // PROGRAM
        // =================================================

        Program program =
                programRepository.findById(
                        request.getProgramId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Program not found: "
                                        + request.getProgramId()
                        )
                );


        // =================================================
        // TRAINER
        // =================================================

        Employee trainer =
                employeeRepository.findById(
                        request.getPersonId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Trainer not found for person ID: "
                                        + request.getPersonId()
                        )
                );


        // =================================================
        // BATCH STATUS
        // =================================================

        BatchStatusMaster status =
                batchStatusRepository.findById(
                        request.getBatchStatusId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Batch status not found: "
                                        + request.getBatchStatusId()
                        )
                );


        // =================================================
        // CREATE BATCH
        // =================================================

        Batch batch = new Batch();


        batch.setBatchCode(
                request.getBatchCode()
        );


        String programName =
                program.getProgramName() == null
                        ? ""
                        : program.getProgramName().trim();


        String batchName =
                programName
                        + " "
                        + request.getStartDate().getMonth()
                        + " "
                        + request.getStartDate().getYear()
                        + " Batch";


        batch.setBatchName(
                batchName
        );


        batch.setProgram(
                program
        );


        batch.setTrainer(
                trainer
        );


        batch.setBatchStatus(
                status
        );


        batch.setStartDate(
                request.getStartDate()
        );


        batch.setEndDate(
                request.getEndDate()
        );


        batch.setMinStudents(
                request.getMinStudents()
        );


        batch.setMaxStudents(
                request.getMaxStudents()
        );


        batch.setCreatedAt(
                LocalDateTime.now()
        );


        Batch saved =
                batchRepository.save(batch);


        return BatchResponse.builder()
                .batchId(
                        saved.getBatchId()
                )
                .batchCode(
                        saved.getBatchCode()
                )
                .build();
    }


    // =====================================================
    // GENERATE BATCH CODE
    // =====================================================

    @Override
    public String generateBatchCode(
            Long programId
    ) {

        if (programId == null) {
            throw new IllegalArgumentException(
                    "Program ID is required"
            );
        }


        Program program =
                programRepository.findById(
                        programId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Program not found: "
                                        + programId
                        )
                );


        String programName =
                program.getProgramName() == null
                        ? ""
                        : program.getProgramName().trim();


        String prefix =
                programName.length() >= 3
                        ? programName.substring(0, 3)
                        : programName;


        return prefix.toUpperCase()
                + "-2026-B"
                + (batchRepository.count() + 1);
    }


    // =====================================================
    // GET ALL PROGRAMS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<Program> getAllPrograms() {

        return programRepository.findAll();
    }


    // =====================================================
    // GET ALL BATCHES
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BatchResponse> getAllBatches() {

        List<BatchResponse> batches =
                batchRepository.getBatchList();


        LocalDate today =
                LocalDate.now();


        batches.forEach(batch -> {

            if (batch.getStartDate() == null ||
                    batch.getEndDate() == null) {

                return;
            }


            if (today.isBefore(
                    batch.getStartDate()
            )) {

                batch.setStatus(
                        "UPCOMING"
                );

            } else if (today.isAfter(
                    batch.getEndDate()
            )) {

                batch.setStatus(
                        "COMPLETED"
                );

            } else {

                batch.setStatus(
                        "ONGOING"
                );
            }
        });


        return batches;
    }


    // =====================================================
    // ASSIGN TRAINER
    // =====================================================

    @Override
    public void assignTrainer(
            AssignTrainerRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Assign trainer request cannot be null"
            );
        }

        if (request.getBatchId() == null) {
            throw new IllegalArgumentException(
                    "Batch ID is required"
            );
        }

        if (request.getPersonId() == null) {
            throw new IllegalArgumentException(
                    "Trainer person ID is required"
            );
        }


        Batch batch =
                batchRepository.findById(
                        request.getBatchId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Batch not found: "
                                        + request.getBatchId()
                        )
                );


        Employee trainer =
                employeeRepository.findById(
                        request.getPersonId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Trainer not found for person ID: "
                                        + request.getPersonId()
                        )
                );


        batch.setTrainer(
                trainer
        );


        batchRepository.save(
                batch
        );
    }


    // =====================================================
    // GET BATCH DETAILS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BatchDetailsResponse getBatchDetails(
            Long batchId
    ) {

        if (batchId == null) {
            throw new IllegalArgumentException(
                    "Batch ID cannot be null"
            );
        }


        Batch batch =
                batchRepository.findBatchDetails(
                        batchId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Batch not found: "
                                        + batchId
                        )
                );


        BatchDetailsResponse response =
                new BatchDetailsResponse();


        // =================================================
        // BASIC INFORMATION
        // =================================================

        response.setBatchId(
                batch.getBatchId()
        );


        response.setBatchCode(
                batch.getBatchCode()
        );


        response.setBatchName(
                batch.getBatchName()
        );


        // =================================================
        // PROGRAM
        // =================================================

        if (batch.getProgram() != null) {

            response.setProgramId(
                    batch.getProgram()
                            .getProgramId()
            );


            response.setProgramName(
                    batch.getProgram()
                            .getProgramName()
            );
        }


        // =================================================
        // TRAINER
        // =================================================

        if (batch.getTrainer() != null) {

            Employee trainer =
                    batch.getTrainer();


            response.setPersonId(
                    trainer.getPersonId()
            );


            if (trainer.getPerson() != null) {

                Person trainerPerson =
                        trainer.getPerson();


                String firstName =
                        trainerPerson.getFirstName() == null
                                ? ""
                                : trainerPerson.getFirstName();


                String lastName =
                        trainerPerson.getLastName() == null
                                ? ""
                                : trainerPerson.getLastName();


                String trainerName =
                        (firstName + " " + lastName)
                                .trim();


                response.setTrainerName(
                        trainerName
                );


                response.setTrainerEmail(
                        getEmail(
                                trainerPerson
                        )
                );
            }
        }


        // =================================================
        // BATCH STATUS
        // =================================================

        if (batch.getBatchStatus() != null) {

            response.setBatchStatusId(
                    batch.getBatchStatus()
                            .getBatchStatusId()
            );


            if (batch.getStartDate() != null &&
                    batch.getEndDate() != null) {

                LocalDate today =
                        LocalDate.now();


                if (today.isBefore(
                        batch.getStartDate()
                )) {

                    response.setBatchStatusName(
                            "UPCOMING"
                    );

                } else if (today.isAfter(
                        batch.getEndDate()
                )) {

                    response.setBatchStatusName(
                            "COMPLETED"
                    );

                } else {

                    response.setBatchStatusName(
                            "ONGOING"
                    );
                }
            }
        }


        // =================================================
        // DATES
        // =================================================

        response.setStartDate(
                batch.getStartDate()
        );


        response.setEndDate(
                batch.getEndDate()
        );


        response.setCreatedAt(
                batch.getCreatedAt()
        );


        // =================================================
        // CAPACITY
        // =================================================

        long actualStrength =
                studentBatchRepository
                        .countByBatchBatchId(
                                batch.getBatchId()
                        );


        response.setCurrentStrength(
                (int) actualStrength
        );


        Integer maxStudents =
                batch.getMaxStudents();


        response.setMaxStudents(
                maxStudents
        );


        int remainingSeats =
                maxStudents == null
                        ? 0
                        : Math.max(
                        0,
                        maxStudents
                        - (int) actualStrength
                );


        response.setRemainingSeats(
                remainingSeats
        );


        // =================================================
        // DURATION
        // =================================================

        if (batch.getStartDate() != null &&
                batch.getEndDate() != null) {

            int days =
                    (int) ChronoUnit.DAYS.between(
                            batch.getStartDate(),
                            batch.getEndDate()
                    );


            response.setDurationInDays(
                    days
            );
        }


        // =================================================
        // STUDENTS
        // =================================================

        List<BatchStudentResponse> students =
                studentBatchRepository
                        .findByBatch(batch)
                        .stream()
                        .filter(studentBatch ->
                                studentBatch
                                        .getStudentApplication()
                                        != null
                        )
                        .map(studentBatch -> {

                            StudentApplication student =
                                    studentBatch
                                            .getStudentApplication();


                            BatchStudentResponse dto =
                                    new BatchStudentResponse();


                            dto.setPersonId(
                                    student.getPersonId()
                            );


                            // =================================
                            // STUDENT PERSON
                            // =================================

                            if (student.getPerson() != null) {

                                Person studentPerson =
                                        student.getPerson();


                                String firstName =
                                        studentPerson
                                                .getFirstName() == null
                                                ? ""
                                                : studentPerson
                                                  .getFirstName();


                                String lastName =
                                        studentPerson
                                                .getLastName() == null
                                                ? ""
                                                : studentPerson
                                                  .getLastName();


                                dto.setStudentName(
                                        (
                                                firstName
                                                        + " "
                                                        + lastName
                                        ).trim()
                                );


                                dto.setEmail(
                                        getEmail(
                                                studentPerson
                                        )
                                );
                            }


                            // =================================
                            // APPLICATION STAGE
                            // =================================

                            if (student
                                    .getApplicationStage()
                                    != null) {

                                dto.setApplicationStageId(
                                        student
                                                .getApplicationStage()
                                                .getApplicationStageId()
                                );


                                dto.setApplicationStage(
                                        student
                                                .getApplicationStage()
                                                .getApplicationStageName()
                                );
                            }


                            return dto;

                        })
                        .toList();


        response.setStudents(
                students
        );


        return response;
    }


    // =====================================================
    // UPDATE BATCH
    // =====================================================

    @Override
    public BatchResponse updateBatch(
            Long batchId,
            UpdateBatchRequest request
    ) {

        if (batchId == null) {
            throw new IllegalArgumentException(
                    "Batch ID cannot be null"
            );
        }

        if (request == null) {
            throw new IllegalArgumentException(
                    "Update batch request cannot be null"
            );
        }


        Batch batch =
                batchRepository.findById(
                        batchId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Batch not found: "
                                        + batchId
                        )
                );


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (request.getStartDate() == null) {
            throw new IllegalArgumentException(
                    "Start date is required"
            );
        }


        if (request.getEndDate() == null) {
            throw new IllegalArgumentException(
                    "End date is required"
            );
        }


        if (request.getEndDate().isBefore(
                request.getStartDate()
        )) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }


        if (request.getMaxStudents() == null) {
            throw new IllegalArgumentException(
                    "Maximum students is required"
            );
        }


        // =================================================
        // BATCH BASIC FIELDS
        // =================================================

        batch.setBatchName(
                request.getBatchName()
        );


        batch.setStartDate(
                request.getStartDate()
        );


        batch.setEndDate(
                request.getEndDate()
        );


        long actualStrength =
                studentBatchRepository
                        .countByBatchBatchId(
                                batch.getBatchId()
                        );


        if (request.getMaxStudents()
                < actualStrength) {

            throw new IllegalArgumentException(
                    "Max students cannot be less than current strength"
            );
        }


        batch.setMaxStudents(
                request.getMaxStudents()
        );


        // =================================================
        // TRAINER
        // =================================================

        if (request.getPersonId() != null) {

            Employee trainer =
                    employeeRepository.findById(
                            request.getPersonId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Trainer not found for person ID: "
                                            + request.getPersonId()
                            )
                    );


            batch.setTrainer(
                    trainer
            );
        }


        // =================================================
        // PROGRAM
        // =================================================

        if (request.getProgramId() != null) {

            Program program =
                    programRepository.findById(
                            request.getProgramId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Program not found: "
                                            + request.getProgramId()
                            )
                    );


            batch.setProgram(
                    program
            );
        }


        // =================================================
        // STATUS
        // =================================================

        if (request.getBatchStatusId() != null) {

            BatchStatusMaster status =
                    batchStatusRepository.findById(
                            request.getBatchStatusId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Batch status not found: "
                                            + request.getBatchStatusId()
                            )
                    );


            batch.setBatchStatus(
                    status
            );
        }


        Batch updated =
                batchRepository.save(
                        batch
                );


        return BatchResponse.builder()
                .batchId(
                        updated.getBatchId()
                )
                .batchCode(
                        updated.getBatchCode()
                )
                .build();
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public Map<String, Integer> getBatchDashboard() {

        Map<String, Integer> stats =
                new HashMap<>();


        List<Batch> batches =
                batchRepository.findAll();


        int ongoing = 0;

        int upcoming = 0;

        int completed = 0;


        LocalDate today =
                LocalDate.now();


        for (Batch batch : batches) {

            if (batch.getStartDate() == null ||
                    batch.getEndDate() == null) {

                continue;
            }


            if (today.isBefore(
                    batch.getStartDate()
            )) {

                upcoming++;

            } else if (today.isAfter(
                    batch.getEndDate()
            )) {

                completed++;

            } else {

                ongoing++;
            }
        }


        stats.put(
                "totalBatches",
                batches.size()
        );


        stats.put(
                "ongoingBatches",
                ongoing
        );


        stats.put(
                "upcomingBatches",
                upcoming
        );


        stats.put(
                "completedBatches",
                completed
        );


        return stats;
    }


    // =====================================================
    // DASHBOARD RESPONSE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BatchDashboardResponse getDashboard() {

        List<Batch> batches =
                batchRepository.findAll();


        int ongoing = 0;

        int upcoming = 0;

        int completed = 0;


        LocalDate today =
                LocalDate.now();


        for (Batch batch : batches) {

            if (batch.getStartDate() == null ||
                    batch.getEndDate() == null) {

                continue;
            }


            if (today.isBefore(
                    batch.getStartDate()
            )) {

                upcoming++;

            } else if (today.isAfter(
                    batch.getEndDate()
            )) {

                completed++;

            } else {

                ongoing++;
            }
        }


        return BatchDashboardResponse
                .builder()
                .totalBatches(
                        batches.size()
                )
                .ongoingBatches(
                        ongoing
                )
                .upcomingBatches(
                        upcoming
                )
                .completedBatches(
                        completed
                )
                .build();
    }


    // =====================================================
    // GET ALL TRAINERS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<TrainerDropdownResponse> getAllTrainers() {

        return employeeRepository
                .getTrainerDropdown();
    }


    // =====================================================
    // DELETE BATCH
    // =====================================================

    @Override
    public void deleteBatch(
            Long batchId
    ) {

        if (batchId == null) {
            throw new IllegalArgumentException(
                    "Batch ID cannot be null"
            );
        }


        if (!batchRepository.existsById(
                batchId
        )) {

            throw new RuntimeException(
                    "Batch not found: "
                            + batchId
            );
        }


        batchRepository.deleteById(
                batchId
        );
    }


    // =====================================================
    // GET EMAIL
    // =====================================================

    private String getEmail(
            Person person
    ) {

        if (person == null) {
            return "";
        }


        if (person.getContacts() == null) {
            return "";
        }


        return person.getContacts()
                .stream()
                .filter(contact ->
                        contact != null
                                && contact.getContactType() != null
                                && "PRIMARY_EMAIL"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )
                .map(PersonContact::getContactValue)
                .filter(value ->
                        value != null
                                && !value.isBlank()
                )
                .findFirst()
                .orElse("");
    }


    // =====================================================
    // GET PHONE
    // =====================================================

    private String getPhone(
            Person person
    ) {

        if (person == null) {
            return "";
        }


        if (person.getContacts() == null) {
            return "";
        }


        return person.getContacts()
                .stream()
                .filter(contact ->
                        contact != null
                                && contact.getContactType() != null
                                && "PHONE"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                )
                )
                .map(PersonContact::getContactValue)
                .filter(value ->
                        value != null
                                && !value.isBlank()
                )
                .findFirst()
                .orElse("");
    }


    // =====================================================
    // AVAILABLE TRAINERS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<TrainerDropdownResponse>
    getAvailableTrainers() {

        return employeeRepository
                .getAvailableTrainerDropdown();
    }


    // =====================================================
    // AVAILABLE TRAINERS FOR EDIT
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<TrainerDropdownResponse>
    getAvailableTrainersForEdit(
            Long batchId
    ) {

        if (batchId == null) {
            throw new IllegalArgumentException(
                    "Batch ID cannot be null"
            );
        }


        return employeeRepository
                .getAvailableTrainerDropdownForEdit(
                        batchId
                );
    }
}

