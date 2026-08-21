package com.lms_erp.trainer.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.dto.*;

import com.lms_erp.trainer.service
        .TrainerBatchService;
import com.lms_erp.trainer.service.TrainerDropRequestService;
import jakarta.validation.Valid;

import com.lms_erp.trainer.dto.StudentDropRequestResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lms_erp.employee.repository.EmployeeRepository;
import java.util.List;

@RestController
@RequestMapping("/api/trainer-batches")
@RequiredArgsConstructor

public class TrainerBatchController {

    private final
    TrainerBatchService
            trainerBatchService;
    private final CurrentUserService currentUserService;
    private final TrainerDropRequestService trainerDropRequestService;
    private final EmployeeRepository employeeRepository;
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping
    public List<TrainerBatchResponse> getTrainerBatchesByUserId() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerBatchService
                .getTrainerBatchesByUserId(userId);
    }
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/all-batches")
    public List<TrainerBatchDetailsResponse> getAllBatches() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerBatchService
                .getMyBatchDetails(userId);
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/summary")
    public List<TrainerBatchSummaryResponse> getBatchSummary() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerBatchService
                .getBatchSummary(userId);
    }
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/batch-page")
    public List<TrainerBatchPageResponse> getBatchPage() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerBatchService
                .getTrainerBatchPage(userId);
    }



    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/batch/{batchId}/students")
    public List<TrainerBatchStudentResponse> getBatchStudents(
            @PathVariable Long batchId,
            @RequestParam(required = false, defaultValue = "ALL") String type
    ) {

        return trainerBatchService.getBatchStudents(
                batchId,
                type
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping("/drop-student/{studentBatchId}")
    public StudentDropRequestResponse createDropRequest(
            @PathVariable Long studentBatchId,
            @RequestBody @Valid DropStudentRequest request
    ) {

        Long trainerPersonId = currentUserService
                .getCurrentEmployee()
                .getPersonId();

        return trainerDropRequestService.createDropRequest(
                studentBatchId,
                trainerPersonId,
                request
        );
    }
}