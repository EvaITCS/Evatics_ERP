package com.lms_erp.student.controller;

import com.lms_erp.student.dto.StudentSupportRequest;
import com.lms_erp.student.dto.SupportTicketResponse;
import com.lms_erp.student.service.StudentSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student")
public class StudentSupportController {

    private final StudentSupportService supportService;

    // =====================================================
    // STUDENT - CREATE SUPPORT TICKET
    // =====================================================

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/support")
    public String createSupportTicket(
            @RequestBody StudentSupportRequest request
    ) {

        return supportService.createTicket(request);

    }

    // =====================================================
    // COUNSELOR - GET MY STUDENTS OPEN TICKETS
    // =====================================================

    @PreAuthorize("hasRole('COUNSELLOR')")
    @GetMapping("/counselor/support-tickets")
    public List<SupportTicketResponse> getCounselorTickets() {

        return supportService.getCounselorTickets();

    }

    // =====================================================
    // ADMIN - GET ALL OPEN TICKETS
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/support-tickets")
    public List<SupportTicketResponse> getAdminTickets() {

        return supportService.getAdminTickets();

    }

    // =====================================================
    // ADMIN / COUNSELOR - RESOLVE TICKET
    // =====================================================

    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    @PutMapping("/support/{ticketId}/resolve")
    public String resolveTicket(
            @PathVariable Long ticketId
    ) {

        return supportService.resolveTicket(ticketId);

    }

}