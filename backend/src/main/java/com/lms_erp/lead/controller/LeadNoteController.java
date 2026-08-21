package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.LeadNoteRequest;
import com.lms_erp.lead.entity.LeadNote;
import com.lms_erp.lead.service.LeadNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lead-notes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
public class LeadNoteController {

    private final LeadNoteService leadNoteService;

    // =====================================================
    // ADD NOTE
    // =====================================================

    @PostMapping
    public ResponseEntity<String> addNote(
            @Valid
            @RequestBody LeadNoteRequest request
    ) {

        leadNoteService.addNote(request);

        return ResponseEntity.ok("Note added successfully");
    }

    // =====================================================
    // GET LEAD NOTES
    // =====================================================

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<LeadNote>> getLeadNotes(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadNoteService.getLeadNotes(leadId)
        );
    }
}