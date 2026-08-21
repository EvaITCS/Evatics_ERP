package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.AdminReassignCounsellorRequest;
import com.lms_erp.lead.service.AdminFollowupEscalationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/followup-escalations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFollowupEscalationController {

    private final AdminFollowupEscalationService escalationService;


    // =====================================================
    // REASSIGN COUNSELLOR
    // =====================================================

    @PutMapping("/{notificationId}/reassign")
    public ResponseEntity<String> reassignCounsellor(
            @PathVariable Long notificationId,

            @Valid
            @RequestBody
            AdminReassignCounsellorRequest request
    ) {

        escalationService.reassignCounsellor(
                notificationId,
                request
        );

        return ResponseEntity.ok(
                "Lead reassigned and follow-up cycle reset successfully."
        );
    }


    // =====================================================
    // RESET FOLLOW-UP CYCLE
    // SAME COUNSELLOR
    // =====================================================

    @PutMapping("/{personId}/reset")
    public ResponseEntity<String> resetFollowupCycle(
            @PathVariable Long personId
    ) {

        escalationService.resetFollowupCycle(
                personId
        );

        return ResponseEntity.ok(
                "Follow-up cycle reset successfully."
        );
    }
}