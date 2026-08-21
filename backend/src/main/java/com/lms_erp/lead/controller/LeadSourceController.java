package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.LeadSourceRequest;
import com.lms_erp.lead.dto.LeadSourceResponse;
import com.lms_erp.lead.service.LeadSourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lead-sources")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
public class LeadSourceController {

    private final LeadSourceService leadSourceService;

    // =====================================================
    // CREATE LEAD SOURCE
    // =====================================================

    @PostMapping
    public ResponseEntity<LeadSourceResponse> save(
            @Valid
            @RequestBody LeadSourceRequest request
    ) {

        return ResponseEntity.ok(
                leadSourceService.save(request)
        );
    }

    // =====================================================
    // GET ALL LEAD SOURCES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<LeadSourceResponse>> getAll() {

        return ResponseEntity.ok(
                leadSourceService.getAll()
        );
    }


}