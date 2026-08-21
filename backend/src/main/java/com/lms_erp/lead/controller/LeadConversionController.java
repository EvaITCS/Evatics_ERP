package com.lms_erp.lead.controller;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.service.LeadConversionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lead-conversion")
@RequiredArgsConstructor
public class LeadConversionController {

    private final LeadConversionService leadConversionService;

    // =====================================================
    // CONVERT LEAD
    // =====================================================

    @PutMapping("/{leadId}/convert")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<Lead> convertLead(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadConversionService.convertLead(leadId)
        );
    }

    // =====================================================
    // INSERT LEAD
    // =====================================================

    @PutMapping("/{leadId}/insert")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<Lead> insertLead(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadConversionService.insertLead(leadId)
        );
    }

    // =====================================================
    // ARCHIVE LEAD
    // =====================================================

    @PutMapping("/{leadId}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lead> archiveLead(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadConversionService.archiveLead(leadId)
        );
    }
}