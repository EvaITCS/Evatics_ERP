package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.CreateLeadRequest;
import com.lms_erp.lead.dto.LeadActivityResponse;
import com.lms_erp.lead.dto.LeadAssignmentResponse;
import com.lms_erp.lead.dto.LeadResponse;
import com.lms_erp.lead.dto.LeadStatusHistoryResponse;
import com.lms_erp.lead.dto.UpdateLeadStatusRequest;
import com.lms_erp.lead.service.LeadService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;


    // =====================================================
    // CREATE LEAD
    // =====================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<LeadResponse> createLead(
            @Valid
            @RequestBody CreateLeadRequest request
    ) {

        return ResponseEntity.ok(
                leadService.createLead(request)
        );
    }


    // =====================================================
    // GET ALL ACTIVE LEADS
    // ADMIN ONLY
    //
    // Shows every active lead in the system.
    // createdBy does NOT restrict this list.
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> getAllLeads() {

        return ResponseEntity.ok(
                leadService.getAllLeads()
        );
    }


    // =====================================================
    // GET MY LEADS
    //
    // ADMIN:
    //     Shows leads currently assigned to admin.
    //
    // COUNSELLOR:
    //     Shows leads currently assigned to that counsellor.
    //
    // IMPORTANT:
    // This is based on LeadAssignment, NOT createdBy.
    // =====================================================

    @GetMapping("/my-leads")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> getMyLeads() {

        return ResponseEntity.ok(
                leadService.getMyLeads()
        );
    }


    // =====================================================
    // GET LEAD BY PERSON ID
    // =====================================================

    @GetMapping("/{personId}")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<LeadResponse> getLeadById(
            @PathVariable Long personId
    ) {

        return ResponseEntity.ok(
                leadService.getLeadById(personId)
        );
    }


    // =====================================================
    // UPDATE LEAD STATUS
    // =====================================================

    @PutMapping("/{leadId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<String> updateLeadStatus(
            @PathVariable Long leadId,

            @Valid
            @RequestBody UpdateLeadStatusRequest request
    ) {

        leadService.updateLeadStatus(
                leadId,
                request
        );

        return ResponseEntity.ok(
                "Lead status updated successfully."
        );
    }


    // =====================================================
    // ARCHIVE LEAD
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{leadId}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> archiveLead(
            @PathVariable Long leadId
    ) {

        leadService.archiveLead(leadId);

        return ResponseEntity.ok(
                "Lead archived successfully."
        );
    }


    // =====================================================
    // SEARCH LEADS
    //
    // ADMIN ONLY
    //
    // Because current searchLeads() searches all active leads.
    // A separate searchMyLeads() should be created later
    // if counsellor-side server search is required.
    // =====================================================

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> searchLeads(
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                leadService.searchLeads(keyword)
        );
    }


    // =====================================================
    // FILTER LEADS
    //
    // ADMIN:
    //     Can filter all active leads and by counsellor.
    //
    // COUNSELLOR:
    //     Service layer must restrict results to the
    //     currently logged-in counsellor.
    // =====================================================

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> filterLeads(

            @RequestParam(required = false)
            Long counsellorPersonId,

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String status,

            @RequestParam(required = false)
            String priority,

            @RequestParam(required = false)
            String fromDate,

            @RequestParam(required = false)
            String toDate
    ) {

        LocalDateTime start = null;
        LocalDateTime end = null;


        // -------------------------------------------------
        // FROM DATE
        // -------------------------------------------------

        if (fromDate != null && !fromDate.isBlank()) {

            start =
                    LocalDate
                            .parse(fromDate)
                            .atStartOfDay();
        }


        // -------------------------------------------------
        // TO DATE
        // -------------------------------------------------

        if (toDate != null && !toDate.isBlank()) {

            // End exclusive:
            // next day at 00:00

            end =
                    LocalDate
                            .parse(toDate)
                            .plusDays(1)
                            .atStartOfDay();
        }


        return ResponseEntity.ok(
                leadService.filterLeads(
                        counsellorPersonId,
                        keyword,
                        status,
                        priority,
                        start,
                        end
                )
        );
    }


    // =====================================================
    // FILTER LEADS BY STATUS
    // ADMIN ONLY
    // =====================================================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> getLeadsByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                leadService.getLeadsByStatus(status)
        );
    }


    // =====================================================
    // GET MY LEADS BY STATUS
    // COUNSELLOR ONLY
    // =====================================================

    @GetMapping("/my-leads/status/{status}")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> getMyLeadsByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                leadService.getMyLeadsByStatus(status)
        );
    }


    // =====================================================
    // RE-ENGAGEMENT LEADS
    // ADMIN
    //
    // Shows ALL active RE_ENGAGEMENT leads.
    // =====================================================

    @GetMapping("/re-engagement")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> getReEngagementLeads() {

        return ResponseEntity.ok(
                leadService.getReEngagementLeads()
        );
    }


    // =====================================================
    // MY RE-ENGAGEMENT LEADS
    // COUNSELLOR
    //
    // Shows only RE_ENGAGEMENT leads currently assigned
    // to the logged-in counsellor.
    // =====================================================

    @GetMapping("/my-re-engagement")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> getMyReEngagementLeads() {

        return ResponseEntity.ok(
                leadService.getMyReEngagementLeads()
        );
    }


    // =====================================================
    // ASSIGN / REASSIGN LEAD
    // ADMIN ONLY
    //
    // Admin can move a lead from one employee to another.
    // =====================================================

    @PutMapping("/{leadId}/assign/{employeePersonId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignLead(

            @PathVariable Long leadId,

            @PathVariable Long employeePersonId
    ) {

        leadService.assignLead(
                leadId,
                employeePersonId
        );

        return ResponseEntity.ok(
                "Lead assigned successfully."
        );
    }


    // =====================================================
    // STATUS HISTORY
    // =====================================================

    @GetMapping("/{leadId}/status-history")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<LeadStatusHistoryResponse>> getStatusHistory(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadService.getLeadStatusHistory(leadId)
        );
    }


    // =====================================================
    // ASSIGNMENT HISTORY
    // =====================================================

    @GetMapping("/{leadId}/assignment-history")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<LeadAssignmentResponse>> getAssignmentHistory(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                leadService.getLeadAssignmentHistory(leadId)
        );
    }


    // =====================================================
    // LEAD ACTIVITIES
    // =====================================================

    @GetMapping("/{personId}/activities")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<LeadActivityResponse>> getActivities(
            @PathVariable Long personId
    ) {

        return ResponseEntity.ok(
                leadService.getLeadActivities(personId)
        );
    }


    // =====================================================
    // APPLICATION STARTED
    // =====================================================

    @PutMapping("/{leadId}/application-started")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<String> applicationStarted(
            @PathVariable Long leadId
    ) {

        leadService.markApplicationStarted(leadId);

        return ResponseEntity.ok(
                "Application Started"
        );
    }


    // =====================================================
    // INTERESTED LEADS
    // ADMIN
    //
    // Shows ALL interested active leads.
    // =====================================================

    @GetMapping("/interested")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> getInterestedLeads() {

        return ResponseEntity.ok(
                leadService.getInterestedLeads()
        );
    }


    // =====================================================
    // MY INTERESTED LEADS
    // COUNSELLOR
    //
    // Shows only interested leads currently assigned
    // to logged-in counsellor.
    // =====================================================

    @GetMapping("/my-interested")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> getMyInterestedLeads() {

        return ResponseEntity.ok(
                leadService.getMyInterestedLeads()
        );
    }

    @GetMapping("/interested/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> filterInterestedLeads(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String fromDate,

            @RequestParam(required = false)
            String toDate
    ) {

        LocalDateTime start = null;
        LocalDateTime end = null;

        if (fromDate != null && !fromDate.isBlank()) {

            start = LocalDate
                    .parse(fromDate)
                    .atStartOfDay();
        }

        if (toDate != null && !toDate.isBlank()) {

            end = LocalDate
                    .parse(toDate)
                    .plusDays(1)
                    .atStartOfDay();
        }

        return ResponseEntity.ok(
                leadService.filterInterestedLeads(
                        keyword,
                        start,
                        end
                )
        );
    }


    @GetMapping("/my-interested/filter")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> filterMyInterestedLeads(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String fromDate,

            @RequestParam(required = false)
            String toDate
    ) {

        LocalDateTime start = null;
        LocalDateTime end = null;

        if (fromDate != null && !fromDate.isBlank()) {

            start = LocalDate
                    .parse(fromDate)
                    .atStartOfDay();
        }

        if (toDate != null && !toDate.isBlank()) {

            end = LocalDate
                    .parse(toDate)
                    .plusDays(1)
                    .atStartOfDay();
        }

        return ResponseEntity.ok(
                leadService.filterMyInterestedLeads(
                        keyword,
                        start,
                        end
                )
        );
    }

    @GetMapping("/re-engagement/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadResponse>> filterReEngagementLeads(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long counsellorPersonId,

            @RequestParam(required = false)
            String fromDate,

            @RequestParam(required = false)
            String toDate
    ) {

        LocalDateTime start = null;
        LocalDateTime end = null;

        if (fromDate != null && !fromDate.isBlank()) {

            start = LocalDate
                    .parse(fromDate)
                    .atStartOfDay();
        }

        if (toDate != null && !toDate.isBlank()) {

            end = LocalDate
                    .parse(toDate)
                    .plusDays(1)
                    .atStartOfDay();
        }

        return ResponseEntity.ok(
                leadService.filterReEngagementLeads(
                        counsellorPersonId,
                        keyword,
                        start,
                        end
                )
        );
    }


    @GetMapping("/my-re-engagement/filter")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<LeadResponse>> filterMyReEngagementLeads(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            String fromDate,

            @RequestParam(required = false)
            String toDate
    ) {

        LocalDateTime start = null;
        LocalDateTime end = null;

        if (fromDate != null && !fromDate.isBlank()) {

            start = LocalDate
                    .parse(fromDate)
                    .atStartOfDay();
        }

        if (toDate != null && !toDate.isBlank()) {

            end = LocalDate
                    .parse(toDate)
                    .plusDays(1)
                    .atStartOfDay();
        }

        return ResponseEntity.ok(
                leadService.filterMyReEngagementLeads(
                        keyword,
                        start,
                        end
                )
        );
    }
}