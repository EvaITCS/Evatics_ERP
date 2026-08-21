package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.AdminFollowupActionRequest;
import com.lms_erp.lead.service.AdminFollowupActionService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/followups")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFollowupActionController {


    private final AdminFollowupActionService
            adminFollowupActionService;


    // =====================================================
    // RESET FOLLOW-UP CYCLE
    // =====================================================


    // =====================================================
    // REASSIGN COUNSELLOR
    // =====================================================

    @PutMapping("/reassign")
    public ResponseEntity<String> reassignCounsellor(

            @Valid
            @RequestBody
            AdminFollowupActionRequest request

    ) {

        adminFollowupActionService
                .reassignCounsellor(request);


        return ResponseEntity.ok(
                "Lead reassigned and follow-up cycle reset successfully."
        );
    }
}