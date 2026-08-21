package com.lms_erp.trainer.service.impl;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.trainer.dto.*;
import com.lms_erp.trainer.entity.StudentDropRequest;
import com.lms_erp.trainer.entity.StudentDropStatus;
import com.lms_erp.trainer.repository.StudentDropRequestRepository;
import com.lms_erp.trainer.repository.StudentDropStatusRepository;
import com.lms_erp.trainer.service.TrainerDropRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerDropRequestServiceImpl
        implements TrainerDropRequestService {

    private final StudentDropRequestRepository dropRequestRepository;

    private final StudentDropStatusRepository dropStatusRepository;

    private final StudentBatchRepository studentBatchRepository;

    private final ApplicationStageRepository applicationStageRepository;

    private final StudentApplicationRepository studentApplicationRepository;

    private final EmployeeRepository employeeRepository;


    // =========================================================
    // TRAINER - CREATE DROP REQUEST
    // =========================================================

    @Override
    @Transactional
    public StudentDropRequestResponse createDropRequest(
            Long studentBatchId,
            Long trainerPersonId,
            DropStudentRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Drop request data is required"
            );
        }

        if (request.getDropReason() == null
                || request.getDropReason().isBlank()) {

            throw new RuntimeException(
                    "Drop reason is required"
            );
        }

        // -----------------------------------------------------
        // STUDENT BATCH
        // -----------------------------------------------------

        StudentBatch studentBatch =
                studentBatchRepository.findById(studentBatchId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student batch not found: "
                                                + studentBatchId
                                )
                        );


        // -----------------------------------------------------
        // STUDENT APPLICATION
        // -----------------------------------------------------

        StudentApplication application =
                studentBatch.getStudentApplication();

        if (application == null) {
            throw new RuntimeException(
                    "Student application not found"
            );
        }

        if (application.getApplicationStage() == null) {
            throw new RuntimeException(
                    "Application stage not found"
            );
        }


        String currentStage =
                application
                        .getApplicationStage()
                        .getApplicationStageName();


        // Already dropped/completed student
        if ("DROPPED".equalsIgnoreCase(currentStage)
                || "COURSE_COMPLETED".equalsIgnoreCase(currentStage)) {

            throw new RuntimeException(
                    "Drop request cannot be created for a "
                            + currentStage
                            + " student."
            );
        }


        // -----------------------------------------------------
        // TRAINER
        // -----------------------------------------------------

        Employee trainer =
                employeeRepository.findById(trainerPersonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Trainer not found: "
                                                + trainerPersonId
                                )
                        );


        // -----------------------------------------------------
        // DUPLICATE ACTIVE REQUEST
        // -----------------------------------------------------

        if (dropRequestRepository
                .findActiveRequest(studentBatch)
                .isPresent()) {

            throw new RuntimeException(
                    "An active drop request already exists "
                            + "for this student."
            );
        }


        // -----------------------------------------------------
        // PENDING STATUS
        // -----------------------------------------------------

        StudentDropStatus pendingStatus =
                dropStatusRepository
                        .findByStatusName("PENDING")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PENDING status not found"
                                )
                        );


        // -----------------------------------------------------
        // CREATE REQUEST
        // -----------------------------------------------------

        StudentDropRequest dropRequest =
                StudentDropRequest.builder()
                        .studentBatch(studentBatch)
                        .requestedBy(trainer)
                        .dropStatus(pendingStatus)
                        .dropReason(request.getDropReason())
                        .recommendation(request.getRecommendation())
                        .build();


        StudentDropRequest saved =
                dropRequestRepository.save(dropRequest);


        return mapToResponse(saved);
    }


    // =========================================================
    // ADMIN - ASSIGN COUNSELLOR
    // =========================================================

    @Override
    @Transactional
    public StudentDropRequestResponse assignCounselor(
            Long dropRequestId,
            AssignCounselorRequest request,
            Long adminPersonId
    ) {

        // -----------------------------------------------------
        // DROP REQUEST
        // -----------------------------------------------------

        StudentDropRequest dropRequest =
                dropRequestRepository
                        .findByIdWithDetails(dropRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Drop request not found: "
                                                + dropRequestId
                                )
                        );


        // -----------------------------------------------------
        // VALIDATE REQUEST
        // -----------------------------------------------------

        if (request == null
                || request.getCounselorPersonId() == null) {

            throw new RuntimeException(
                    "Counselor Person ID is required"
            );
        }


        // -----------------------------------------------------
        // COUNSELLOR
        // -----------------------------------------------------

        Employee counselor =
                employeeRepository
                        .findById(
                                request.getCounselorPersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Counselor not found: "
                                                + request.getCounselorPersonId()
                                )
                        );


        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        Employee admin =
                employeeRepository
                        .findById(adminPersonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found: "
                                                + adminPersonId
                                )
                        );


        // -----------------------------------------------------
        // ONLY PENDING REQUEST CAN BE ASSIGNED
        // -----------------------------------------------------

        if (dropRequest.getDropStatus() == null
                || !"PENDING".equalsIgnoreCase(
                dropRequest.getDropStatus().getStatusName()
        )) {

            throw new RuntimeException(
                    "Only PENDING drop requests can be assigned."
            );
        }


        // -----------------------------------------------------
        // CORRECT DB STATUS
        // IMPORTANT:
        // DB HAS CONSULTANT_ASSIGNED
        // NOT COUNSELOR_ASSIGNED
        // -----------------------------------------------------

        StudentDropStatus assignedStatus =
                dropStatusRepository
                        .findByStatusName(
                                "CONSULTANT_ASSIGNED"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CONSULTANT_ASSIGNED "
                                                + "status not found"
                                )
                        );


        // -----------------------------------------------------
        // UPDATE REQUEST
        // -----------------------------------------------------

        dropRequest.setAssignedTo(counselor);

        dropRequest.setReviewedBy(admin);

        dropRequest.setAssignedAt(
                LocalDateTime.now()
        );

        dropRequest.setDropStatus(
                assignedStatus
        );


        StudentDropRequest saved =
                dropRequestRepository.save(dropRequest);


        return mapToResponse(saved);
    }


    // =========================================================
    // COUNSELLOR - SUBMIT RECOMMENDATION
    // =========================================================

    @Override
    @Transactional
    public StudentDropRequestResponse submitRecommendation(
            Long dropRequestId,
            Long counselorPersonId,
            CounselorRecommendationRequest request
    ) {

        StudentDropRequest dropRequest =
                dropRequestRepository
                        .findByIdWithDetails(dropRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Drop request not found: "
                                                + dropRequestId
                                )
                        );


        Employee counselor =
                employeeRepository
                        .findById(counselorPersonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Counselor not found: "
                                                + counselorPersonId
                                )
                        );


        // -----------------------------------------------------
        // VERIFY ASSIGNED COUNSELLOR
        // -----------------------------------------------------

        if (dropRequest.getAssignedTo() == null
                || !dropRequest
                .getAssignedTo()
                .getPersonId()
                .equals(counselorPersonId)) {

            throw new RuntimeException(
                    "This drop request is not assigned to you"
            );
        }


        // -----------------------------------------------------
        // REQUEST VALIDATION
        // -----------------------------------------------------

        if (request == null) {

            throw new RuntimeException(
                    "Counselor recommendation is required"
            );
        }


        // -----------------------------------------------------
        // ONLY CONSULTANT_ASSIGNED
        // -----------------------------------------------------

        if (dropRequest.getDropStatus() == null
                || !"CONSULTANT_ASSIGNED".equalsIgnoreCase(
                dropRequest.getDropStatus().getStatusName()
        )) {

            throw new RuntimeException(
                    "Only CONSULTANT_ASSIGNED requests "
                            + "can receive a recommendation."
            );
        }


        // -----------------------------------------------------
        // CORRECT DB STATUS
        // -----------------------------------------------------

        StudentDropStatus completedStatus =
                dropStatusRepository
                        .findByStatusName(
                                "CONSULTANT_COMPLETED"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "CONSULTANT_COMPLETED "
                                                + "status not found"
                                )
                        );


        // -----------------------------------------------------
        // UPDATE
        // -----------------------------------------------------

        dropRequest.setRecommendation(
                request.getRecommendation()
        );

        dropRequest.setReviewRemarks(
                request.getCounselorRemarks()
        );

        dropRequest.setReviewedAt(
                LocalDateTime.now()
        );

        dropRequest.setDropStatus(
                completedStatus
        );


        StudentDropRequest saved =
                dropRequestRepository.save(dropRequest);


        return mapToResponse(saved);
    }


    // =========================================================
    // ADMIN - APPROVE / REJECT
    // =========================================================

    @Override
    @Transactional
    public StudentDropRequestResponse adminDecision(
            Long dropRequestId,
            Long adminPersonId,
            AdminDecisionRequest request
    ) {

        StudentDropRequest dropRequest =
                dropRequestRepository
                        .findByIdWithDetails(dropRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Drop request not found: "
                                                + dropRequestId
                                )
                        );


        Employee admin =
                employeeRepository
                        .findById(adminPersonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found: "
                                                + adminPersonId
                                )
                        );


        if (request == null
                || request.getApproved() == null) {

            throw new RuntimeException(
                    "Admin decision is required"
            );
        }


        // -----------------------------------------------------
        // ADMIN REVIEW
        // -----------------------------------------------------

        dropRequest.setReviewedBy(admin);

        dropRequest.setReviewRemarks(
                request.getReviewRemarks()
        );

        dropRequest.setReviewedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // APPROVED
        // =====================================================

        if (Boolean.TRUE.equals(
                request.getApproved()
        )) {

            // -------------------------------------------------
            // APPROVED STATUS
            // -------------------------------------------------

            StudentDropStatus approvedStatus =
                    dropStatusRepository
                            .findByStatusName("APPROVED")
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "APPROVED status not found"
                                    )
                            );


            dropRequest.setDropStatus(
                    approvedStatus
            );


            // -------------------------------------------------
            // DROPPED APPLICATION STAGE
            // -------------------------------------------------

            ApplicationStageMaster droppedStage =
                    applicationStageRepository
                            .findByApplicationStageName(
                                    "DROPPED"
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "DROPPED application "
                                                    + "stage not found"
                                    )
                            );


            // -------------------------------------------------
            // STUDENT BATCH
            // -------------------------------------------------

            StudentBatch studentBatch =
                    dropRequest.getStudentBatch();


            if (studentBatch == null) {

                throw new RuntimeException(
                        "Student batch not found"
                );
            }


            // -------------------------------------------------
            // STUDENT APPLICATION
            // -------------------------------------------------

            StudentApplication application =
                    studentBatch.getStudentApplication();


            if (application == null) {

                throw new RuntimeException(
                        "Student application not found"
                );
            }


            // -------------------------------------------------
            // CHANGE APPLICATION STAGE
            // -------------------------------------------------

            application.setApplicationStage(
                    droppedStage
            );

            studentApplicationRepository.save(
                    application
            );


            // -------------------------------------------------
            // UPDATE STUDENT BATCH
            // -------------------------------------------------

            studentBatch.setDroppedDate(
                    LocalDate.now()
            );

            studentBatch.setDropReason(
                    dropRequest.getDropReason()
            );

            studentBatchRepository.save(
                    studentBatch
            );

        }


        // =====================================================
        // REJECTED
        // =====================================================

        else {

            StudentDropStatus rejectedStatus =
                    dropStatusRepository
                            .findByStatusName("REJECTED")
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "REJECTED status not found"
                                    )
                            );


            dropRequest.setDropStatus(
                    rejectedStatus
            );
        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        StudentDropRequest saved =
                dropRequestRepository.save(
                        dropRequest
                );


        return mapToResponse(saved);
    }

// =========================================================
// TRAINER REQUESTS
// =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<StudentDropRequestResponse> getTrainerRequests(
            Long trainerPersonId
    ) {

        if (trainerPersonId == null || trainerPersonId <= 0) {
            throw new RuntimeException(
                    "Invalid trainer person ID: " + trainerPersonId
            );
        }

        List<StudentDropRequest> requests =
                dropRequestRepository.findByRequestedByWithDetails(
                        trainerPersonId
                );

        List<StudentDropRequestResponse> response =
                new ArrayList<>();

        for (StudentDropRequest request : requests) {
            response.add(mapToResponse(request));
        }

        return response;
    }


    // =========================================================
    // ADMIN - PENDING REQUESTS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<StudentDropRequestResponse> getPendingRequests() {

        StudentDropStatus pendingStatus =
                dropStatusRepository
                        .findByStatusName("PENDING")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PENDING status not found"
                                )
                        );


        List<StudentDropRequest> requests =
                dropRequestRepository
                        .findByDropStatusWithDetails(
                                pendingStatus
                        );


        return requests.stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET SINGLE REQUEST
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public StudentDropRequestResponse getRequest(
            Long dropRequestId
    ) {

        StudentDropRequest request =
                dropRequestRepository
                        .findByIdWithDetails(dropRequestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Drop request not found: "
                                                + dropRequestId
                                )
                        );


        return mapToResponse(request);
    }


    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private StudentDropRequestResponse mapToResponse(
            StudentDropRequest request
    ) {

        if (request == null) {

            throw new RuntimeException(
                    "Drop request is null"
            );
        }


        StudentBatch studentBatch =
                request.getStudentBatch();


        if (studentBatch == null) {

            throw new RuntimeException(
                    "Student batch not found"
            );
        }


        StudentApplication application =
                studentBatch.getStudentApplication();


        if (application == null) {

            throw new RuntimeException(
                    "Student application not found"
            );
        }


        // =====================================================
        // STUDENT
        // =====================================================

        String studentName = "-";

        if (application.getPerson() != null) {

            String firstName =
                    application.getPerson().getFirstName() != null
                            ? application.getPerson().getFirstName()
                            : "";

            String lastName =
                    application.getPerson().getLastName() != null
                            ? application.getPerson().getLastName()
                            : "";

            studentName =
                    (firstName + " " + lastName).trim();

            if (studentName.isBlank()) {
                studentName = "-";
            }
        }


        // =====================================================
        // TRAINER
        // =====================================================

        Long requestedByPersonId = null;

        String requestedByName = "-";

        if (request.getRequestedBy() != null) {

            requestedByPersonId =
                    request.getRequestedBy()
                            .getPersonId();

            if (request.getRequestedBy().getPerson() != null) {

                String firstName =
                        request.getRequestedBy()
                                .getPerson()
                                .getFirstName() != null
                                ? request.getRequestedBy()
                                .getPerson()
                                .getFirstName()
                                : "";

                String lastName =
                        request.getRequestedBy()
                                .getPerson()
                                .getLastName() != null
                                ? request.getRequestedBy()
                                .getPerson()
                                .getLastName()
                                : "";

                requestedByName =
                        (firstName + " " + lastName).trim();

                if (requestedByName.isBlank()) {
                    requestedByName = "-";
                }
            }
        }


        // =====================================================
        // COUNSELLOR
        // =====================================================

        Long assignedToPersonId = null;

        String assignedToName = "-";

        if (request.getAssignedTo() != null) {

            assignedToPersonId =
                    request.getAssignedTo()
                            .getPersonId();

            if (request.getAssignedTo().getPerson() != null) {

                String firstName =
                        request.getAssignedTo()
                                .getPerson()
                                .getFirstName() != null
                                ? request.getAssignedTo()
                                .getPerson()
                                .getFirstName()
                                : "";

                String lastName =
                        request.getAssignedTo()
                                .getPerson()
                                .getLastName() != null
                                ? request.getAssignedTo()
                                .getPerson()
                                .getLastName()
                                : "";

                assignedToName =
                        (firstName + " " + lastName).trim();

                if (assignedToName.isBlank()) {
                    assignedToName = "-";
                }
            }
        }


        // =====================================================
        // REVIEWED BY
        // =====================================================

        Long reviewedByPersonId = null;

        String reviewedByName = "-";

        if (request.getReviewedBy() != null) {

            reviewedByPersonId =
                    request.getReviewedBy()
                            .getPersonId();

            if (request.getReviewedBy().getPerson() != null) {

                String firstName =
                        request.getReviewedBy()
                                .getPerson()
                                .getFirstName() != null
                                ? request.getReviewedBy()
                                .getPerson()
                                .getFirstName()
                                : "";

                String lastName =
                        request.getReviewedBy()
                                .getPerson()
                                .getLastName() != null
                                ? request.getReviewedBy()
                                .getPerson()
                                .getLastName()
                                : "";

                reviewedByName =
                        (firstName + " " + lastName).trim();

                if (reviewedByName.isBlank()) {
                    reviewedByName = "-";
                }
            }
        }


        // =====================================================
        // BATCH
        // =====================================================

        Long batchId = null;

        String batchCode = "-";

        if (studentBatch.getBatch() != null) {

            batchId =
                    studentBatch
                            .getBatch()
                            .getBatchId();

            batchCode =
                    studentBatch
                            .getBatch()
                            .getBatchCode();

            if (batchCode == null || batchCode.isBlank()) {
                batchCode = "-";
            }
        }


        // =====================================================
        // STATUS
        // =====================================================

        Long dropStatusId = null;

        String dropStatus = "-";

        if (request.getDropStatus() != null) {

            dropStatusId =
                    request.getDropStatus()
                            .getDropStatusId();

            dropStatus =
                    request.getDropStatus()
                            .getStatusName();

            if (dropStatus == null || dropStatus.isBlank()) {
                dropStatus = "-";
            }
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        return StudentDropRequestResponse.builder()

                .dropRequestId(
                        request.getDropRequestId()
                )

                // Student
                .studentBatchId(
                        studentBatch.getStudentBatchId()
                )

                .studentPersonId(
                        application.getPerson() != null
                                ? application
                                .getPerson()
                                .getPersonId()
                                : null
                )

                .studentName(
                        studentName
                )

                // Batch
                .batchId(batchId)

                .batchCode(batchCode)

                // Trainer
                .requestedByPersonId(
                        requestedByPersonId
                )

                .requestedByName(
                        requestedByName
                )

                // Counsellor
                .assignedToPersonId(
                        assignedToPersonId
                )

                .assignedToName(
                        assignedToName
                )

                // Reviewed By
                .reviewedByPersonId(
                        reviewedByPersonId
                )

                .reviewedByName(
                        reviewedByName
                )

                // Status
                .dropStatusId(
                        dropStatusId
                )

                .dropStatus(
                        dropStatus
                )

                // Request Details
                .dropReason(
                        request.getDropReason()
                )

                .recommendation(
                        request.getRecommendation()
                )

                .reviewRemarks(
                        request.getReviewRemarks()
                )

                // Timeline
                .requestedAt(
                        request.getRequestedAt()
                )

                .assignedAt(
                        request.getAssignedAt()
                )

                .reviewedAt(
                        request.getReviewedAt()
                )

                // Audit
                .createdAt(
                        request.getCreatedAt()
                )

                .updatedAt(
                        request.getUpdatedAt()
                )

                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDropRequestResponse> getCounselorRequests(
            Long counselorPersonId
    ) {

        System.out.println("========================================");
        System.out.println("GET COUNSELLOR REQUESTS");
        System.out.println("Counsellor Person ID = " + counselorPersonId);

        if (counselorPersonId == null || counselorPersonId <= 0) {
            throw new RuntimeException(
                    "Invalid counselor person ID: " + counselorPersonId
            );
        }

        try {

            List<StudentDropRequest> requests =
                    dropRequestRepository.findByAssignedToWithDetails(
                            counselorPersonId
                    );

            System.out.println(
                    "REQUEST COUNT = " + requests.size()
            );

            List<StudentDropRequestResponse> response =
                    new ArrayList<>();

            for (StudentDropRequest request : requests) {

                System.out.println(
                        "Mapping Drop Request ID = "
                                + request.getDropRequestId()
                );

                response.add(
                        mapToResponse(request)
                );
            }

            System.out.println(
                    "FINAL RESPONSE COUNT = "
                            + response.size()
            );

            return response;

        } catch (Exception e) {

            System.out.println(
                    "========== COUNSELLOR REQUEST ERROR =========="
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to load counselor requests: "
                            + e.getMessage(),
                    e
            );
        }
    }

}