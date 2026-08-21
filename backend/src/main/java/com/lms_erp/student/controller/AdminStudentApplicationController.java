package com.lms_erp.student.controller;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.batch.repository.BatchRepository;
import com.lms_erp.student.dto.AdminApplicationListResponse;
import com.lms_erp.student.dto.EnrollStudentRequest;
import com.lms_erp.student.dto.RecheckRequest;
import com.lms_erp.student.dto.StudentApplicationResponse;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.invitation.ApplicationInvitationToken;
import com.lms_erp.student.invitation.ApplicationInvitationTokenRepository;
import com.lms_erp.student.invitation.InvitationStatus;
import com.lms_erp.student.repository.ApplicationStageRepository;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.student.service.AdminStudentApplicationService;
import com.lms_erp.student.service.StudentApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/application")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentApplicationController {

    private final StudentApplicationRepository repository;
    private final BatchRepository batchRepository;
    private final StudentBatchRepository studentBatchRepository;
    private final AdminStudentApplicationService adminStudentApplicationService;
    private final ApplicationStageRepository applicationStageRepository;
    private final ApplicationInvitationTokenRepository invitationTokenRepository;
    private final StudentApplicationService studentApplicationService;


    // =========================================================
    // 1. GET ALL APPLICATIONS
    // =========================================================

    @GetMapping("/all")
    public List<AdminApplicationListResponse> getAll() {

        return adminStudentApplicationService.getAllApplications();
    }


    // =========================================================
    // 2. GET SINGLE APPLICATION
    // =========================================================

    @GetMapping("/{id}")
    public StudentApplicationResponse getById(
            @PathVariable Long id
    ) {

        StudentApplication app = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application Not found"
                        )
                );

        return adminStudentApplicationService
                .getStudentProfile(app.getPersonId());
    }


    // =========================================================
    // 3. ENROLL STUDENT
    // =========================================================

    @PutMapping("/enroll/{id}")
    @Transactional
    public String enroll(
            @PathVariable Long id,
            @RequestBody EnrollStudentRequest request
    ) {

        // -----------------------------------------------------
        // Validate batch
        // -----------------------------------------------------

        if (request.getBatchId() == null) {
            throw new RuntimeException(
                    "Please Select Batch"
            );
        }


        // -----------------------------------------------------
        // Find application
        // -----------------------------------------------------

        StudentApplication app = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application Not found"
                        )
                );


        // -----------------------------------------------------
        // Prevent duplicate enrollment
        // -----------------------------------------------------

        if (app.getApplicationStage() != null
                && "ENROLLED".equalsIgnoreCase(
                app.getApplicationStage()
                        .getApplicationStageName()
        )) {

            throw new RuntimeException(
                    "Student Already Enrolled"
            );
        }


        // -----------------------------------------------------
        // Find batch
        // -----------------------------------------------------

        Batch batch = batchRepository
                .findById(request.getBatchId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Batch Not Found"
                        )
                );


        // -----------------------------------------------------
        // Batch status validation
        // -----------------------------------------------------

        if (batch.getBatchStatus() != null
                && batch.getBatchStatus()
                .getBatchStatusName() != null) {

            String batchStatusName =
                    batch.getBatchStatus()
                            .getBatchStatusName();

            if ("COMPLETED".equalsIgnoreCase(
                    batchStatusName)) {

                throw new RuntimeException(
                        "Cannot assign student to completed batch"
                );
            }

            if ("CANCELLED".equalsIgnoreCase(
                    batchStatusName)) {

                throw new RuntimeException(
                        "Cannot assign student to cancelled batch"
                );
            }
        }


        // -----------------------------------------------------
        // Batch capacity validation
        // -----------------------------------------------------

        int currentStr =
                batch.getCurrentStrength() != null
                        ? batch.getCurrentStrength()
                        : 0;

        if (currentStr >= batch.getMaxStudents()) {

            throw new RuntimeException(
                    "Batch Capacity Full"
            );
        }


        // -----------------------------------------------------
        // Prevent student from being assigned twice
        // -----------------------------------------------------

        if (studentBatchRepository
                .existsByStudentApplicationPersonId(
                        app.getPersonId()
                )) {

            throw new RuntimeException(
                    "Student already assigned to a batch"
            );
        }


        // -----------------------------------------------------
        // Get ENROLLED application stage
        // -----------------------------------------------------

        ApplicationStageMaster enrolledStage =
                applicationStageRepository
                        .findByApplicationStageName("ENROLLED")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "ENROLLED stage not found"
                                )
                        );


        // -----------------------------------------------------
        // Create StudentBatch
        // -----------------------------------------------------

        StudentBatch studentBatch =
                new StudentBatch();

        studentBatch.setStudentApplication(app);
        studentBatch.setBatch(batch);
        studentBatch.setApplicationStage(enrolledStage);
        studentBatch.setRemarks(
                "Assigned During Enrollment"
        );
        studentBatch.setAssignedDate(
                LocalDateTime.now()
        );

        studentBatchRepository.save(studentBatch);


        // -----------------------------------------------------
        // Update batch strength
        // -----------------------------------------------------

        batch.setCurrentStrength(
                currentStr + 1
        );

        batchRepository.save(batch);


        // -----------------------------------------------------
        // Application stage → ENROLLED
        // -----------------------------------------------------

        app.setApplicationStage(enrolledStage);

        repository.save(app);


        // =====================================================
        // IMPORTANT:
        //
        // LEAD → STUDENT
        //
        // This happens ONLY after successful enrollment.
        // =====================================================

        studentApplicationService.promoteToStudent(
                app.getPersonId()
        );


        // -----------------------------------------------------
        // Accept invitation token
        // -----------------------------------------------------

        ApplicationInvitationToken invitation =
                invitationTokenRepository
                        .findByStudentApplication(app)
                        .orElse(null);

        if (invitation != null) {

            invitation.setStatus(
                    InvitationStatus.ACCEPTED
            );

            invitation.setAcceptedAt(
                    LocalDateTime.now()
            );

            invitationTokenRepository.save(
                    invitation
            );
        }


        // -----------------------------------------------------
        // Success
        // -----------------------------------------------------

        return "Student Enrolled Successfully";
    }


    // =========================================================
    // 4. SEND BACK / REJECT / RECHECK
    // =========================================================

    @PutMapping("/reject/{id}")
    public String reject(
            @PathVariable Long id,
            @RequestBody RecheckRequest request
    ) {

        StudentApplication app =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application Not found"
                                )
                        );


        ApplicationStageMaster stage =
                applicationStageRepository
                        .findByApplicationStageName(
                                "RECHECK_REQUIRED"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Stage not found"
                                )
                        );


        app.setApplicationStage(stage);

        app.setRecheckReason(
                request.getRecheckReason()
        );

        repository.save(app);


        return "Sent for Recheck";
    }
}