package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.FollowupRequest;
import com.lms_erp.lead.dto.FollowupResponse;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.service.FollowupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
@RequiredArgsConstructor
public class FollowupController {

    private final FollowupService followupService;

    // =====================================================
    // ADD FOLLOW-UP
    // =====================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<String> addFollowup(
            @Valid
            @RequestBody FollowupRequest request
    ) {

        followupService.addFollowup(request);

        return ResponseEntity.ok("Follow-up added successfully");
    }

    // =====================================================
    // GET FOLLOW-UP HISTORY OF A LEAD
    // =====================================================

    @GetMapping("/lead/{leadId}")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<FollowupResponse>> getLeadFollowups(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                followupService.getLeadFollowups(leadId)
        );
    }

    // =====================================================
    // GET LOGGED-IN COUNSELLOR FOLLOW-UPS
    // =====================================================

    @GetMapping("/my-followups")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadFollowup>> getMyFollowups() {

        return ResponseEntity.ok(
                followupService.getMyFollowups()
        );
    }

    // =====================================================
    // GET PENDING FOLLOW-UPS
    // =====================================================

    @GetMapping("/pending")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadFollowup>> getPendingFollowups() {

        return ResponseEntity.ok(
                followupService.getPendingFollowups()
        );
    }
}