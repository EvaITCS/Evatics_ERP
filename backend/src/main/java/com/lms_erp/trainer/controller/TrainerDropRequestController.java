package com.lms_erp.trainer.controller;

import com.lms_erp.trainer.dto.AdminDecisionRequest;
import com.lms_erp.trainer.dto.AssignCounselorRequest;
import com.lms_erp.trainer.dto.CounselorRecommendationRequest;
import com.lms_erp.trainer.dto.DropStudentRequest;
import com.lms_erp.trainer.dto.StudentDropRequestResponse;
import com.lms_erp.trainer.service.TrainerDropRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/trainer/drop-requests")
public class TrainerDropRequestController {

    private final TrainerDropRequestService trainerDropRequestService;


    // =====================================================
    // TRAINER - CREATE DROP REQUEST
    // =====================================================

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping("/{studentBatchId}/trainer/{trainerPersonId}")
    public StudentDropRequestResponse createDropRequest(
            @PathVariable Long studentBatchId,
            @PathVariable Long trainerPersonId,
            @Valid @RequestBody DropStudentRequest request
    ) {

        return trainerDropRequestService.createDropRequest(
                studentBatchId,
                trainerPersonId,
                request
        );
    }


    // =====================================================
    // ADMIN - ASSIGN COUNSELLOR
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{dropRequestId}/assign/{adminPersonId}")
    public StudentDropRequestResponse assignCounselor(
            @PathVariable Long dropRequestId,
            @PathVariable Long adminPersonId,
            @Valid @RequestBody AssignCounselorRequest request
    ) {

        return trainerDropRequestService.assignCounselor(
                dropRequestId,
                request,
                adminPersonId
        );
    }


    // =====================================================
    // COUNSELLOR - GET ASSIGNED REQUESTS
    // =====================================================

    @PreAuthorize("hasRole('COUNSELLOR')")
    @GetMapping("/counselor/{counselorPersonId}")
    public List<StudentDropRequestResponse> getCounselorRequests(
            @PathVariable Long counselorPersonId
    ) {

        System.out.println(
                "========================================"
        );

        System.out.println(
                "COUNSELLOR REQUEST API HIT"
        );

        System.out.println(
                "Counsellor Person ID = "
                        + counselorPersonId
        );

        return trainerDropRequestService.getCounselorRequests(
                counselorPersonId
        );
    }


    // =====================================================
    // COUNSELLOR - SUBMIT RECOMMENDATION
    // =====================================================

    @PreAuthorize("hasRole('COUNSELLOR')")
    @PutMapping("/{dropRequestId}/recommendation/{counselorPersonId}")
    public StudentDropRequestResponse submitRecommendation(
            @PathVariable Long dropRequestId,
            @PathVariable Long counselorPersonId,
            @Valid @RequestBody CounselorRecommendationRequest request
    ) {

        return trainerDropRequestService.submitRecommendation(
                dropRequestId,
                counselorPersonId,
                request
        );
    }


    // =====================================================
    // ADMIN - FINAL DECISION
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{dropRequestId}/decision/{adminPersonId}")
    public StudentDropRequestResponse adminDecision(
            @PathVariable Long dropRequestId,
            @PathVariable Long adminPersonId,
            @Valid @RequestBody AdminDecisionRequest request
    ) {

        return trainerDropRequestService.adminDecision(
                dropRequestId,
                adminPersonId,
                request
        );
    }


    // =====================================================
    // TRAINER REQUESTS
    // =====================================================

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/trainer/{trainerPersonId}")
    public List<StudentDropRequestResponse> getTrainerRequests(
            @PathVariable Long trainerPersonId
    ) {

        return trainerDropRequestService.getTrainerRequests(
                trainerPersonId
        );
    }


    // =====================================================
    // ADMIN - PENDING REQUESTS
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<StudentDropRequestResponse> getPendingRequests() {

        return trainerDropRequestService.getPendingRequests();
    }


    // =====================================================
    // GET SINGLE REQUEST
    // =====================================================

    @PreAuthorize("hasAnyRole('ADMIN','TRAINER','COUNSELLOR')")
    @GetMapping("/{dropRequestId}")
    public StudentDropRequestResponse getRequest(
            @PathVariable Long dropRequestId
    ) {

        return trainerDropRequestService.getRequest(
                dropRequestId
        );
    }
}