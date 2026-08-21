//package com.lms_erp.lead.controller;
//
//import com.lms_erp.lead.dto.NotificationPageResponse;
//import com.lms_erp.lead.dto.ReminderResponse;
//import com.lms_erp.lead.service.ReminderService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/reminders")
//@RequiredArgsConstructor
//public class ReminderController {
//
//    private final ReminderService reminderService;
//
//
//    // =====================================================
//    // COUNSELLOR TODAY
//    // =====================================================
//
//    @GetMapping("/today/my")
//    @PreAuthorize("hasRole('COUNSELLOR')")
//    public ResponseEntity<List<ReminderResponse>>
//    getTodayReminders() {
//
//        return ResponseEntity.ok(
//                reminderService.getTodayReminders()
//        );
//    }
//
//
//    // =====================================================
//    // ADMIN TODAY
//    // =====================================================
//
//    @GetMapping("/today")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<List<ReminderResponse>>
//    getAllTodayReminders() {
//
//        return ResponseEntity.ok(
//                reminderService.getAllTodayReminders()
//        );
//    }
//
//
//    // =====================================================
//    // COUNSELLOR PENDING
//    // =====================================================
//
//    @GetMapping("/pending")
//    @PreAuthorize("hasRole('COUNSELLOR')")
//    public ResponseEntity<List<ReminderResponse>>
//    getPendingFollowups() {
//
//        return ResponseEntity.ok(
//                reminderService.getPendingFollowups()
//        );
//    }
//
//
//    // =====================================================
//    // ADMIN PENDING
//    // =====================================================
//
//    @GetMapping("/pending/all")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<List<ReminderResponse>>
//    getAllPendingFollowups() {
//
//        return ResponseEntity.ok(
//                reminderService.getAllPendingFollowups()
//        );
//    }
//
//
//    // =====================================================
//    // COUNSELLOR OVERDUE
//    // =====================================================
//
//    @GetMapping("/overdue")
//    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
//    public ResponseEntity<List<ReminderResponse>>
//    getOverdueReminders() {
//
//        // IMPORTANT:
//        // For ADMIN, return all overdue.
//        // For COUNSELLOR, return own overdue.
//
//        return ResponseEntity.ok(
//                reminderService.getOverdueReminders()
//        );
//    }
//
//
//    // =====================================================
//    // COMPLETE
//    // =====================================================
//
//    @PutMapping("/{id}/complete")
//    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
//    public ResponseEntity<String>
//    completeReminder(
//            @PathVariable Long id
//    ) {
//
//        reminderService.markCompleted(id);
//
//        return ResponseEntity.ok(
//                "Reminder completed successfully."
//        );
//    }
//
//
//    // =====================================================
//    // LEAD REMINDERS
//    // =====================================================
//
//    @GetMapping("/lead/{leadId}")
//    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
//    public ResponseEntity<List<ReminderResponse>>
//    getLeadReminders(
//            @PathVariable Long leadId
//    ) {
//
//        return ResponseEntity.ok(
//                reminderService.getLeadReminders(
//                        leadId
//                )
//        );
//    }
//
//
//    // =====================================================
//    // NOTIFICATIONS
//    // =====================================================
//
//    @GetMapping("/notifications")
//    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
//    public ResponseEntity<NotificationPageResponse>
//    getNotificationPage() {
//
//        return ResponseEntity.ok(
//                reminderService.getNotificationPage()
//        );
//    }
//}


package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.NotificationPageResponse;
import com.lms_erp.lead.dto.ReminderResponse;
import com.lms_erp.lead.service.ReminderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {


    private final ReminderService reminderService;


    // =====================================================
    // COUNSELLOR TODAY
    // =====================================================

    @GetMapping("/today/my")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<ReminderResponse>>
    getTodayReminders() {

        return ResponseEntity.ok(
                reminderService.getTodayReminders()
        );
    }


    // =====================================================
    // ADMIN TODAY
    // =====================================================

    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReminderResponse>>
    getAllTodayReminders() {

        return ResponseEntity.ok(
                reminderService.getAllTodayReminders()
        );
    }


    // =====================================================
    // COUNSELLOR PENDING
    //
    // TOMORROW ONWARD
    // =====================================================

    @GetMapping("/pending")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<ReminderResponse>>
    getPendingFollowups() {

        return ResponseEntity.ok(
                reminderService.getPendingFollowups()
        );
    }


    // =====================================================
    // ADMIN PENDING
    //
    // TOMORROW ONWARD
    // =====================================================

    @GetMapping("/pending/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReminderResponse>>
    getAllPendingFollowups() {

        return ResponseEntity.ok(
                reminderService.getAllPendingFollowups()
        );
    }


    // =====================================================
    // COUNSELLOR OVERDUE
    // =====================================================

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<List<ReminderResponse>>
    getOverdueReminders() {

        return ResponseEntity.ok(
                reminderService.getOverdueReminders()
        );
    }


    // =====================================================
    // ADMIN OVERDUE
    // =====================================================

    @GetMapping("/overdue/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReminderResponse>>
    getAllOverdueReminders() {

        return ResponseEntity.ok(
                reminderService.getAllOverdueReminders()
        );
    }


    // =====================================================
    // COMPLETE REMINDER
    // =====================================================

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<String>
    completeReminder(
            @PathVariable Long id
    ) {

        reminderService.markCompleted(id);

        return ResponseEntity.ok(
                "Reminder completed successfully."
        );
    }


    // =====================================================
    // LEAD REMINDERS
    // =====================================================

    @GetMapping("/lead/{leadId}")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<List<ReminderResponse>>
    getLeadReminders(
            @PathVariable Long leadId
    ) {

        return ResponseEntity.ok(
                reminderService.getLeadReminders(
                        leadId
                )
        );
    }


    // =====================================================
    // NOTIFICATION PAGE
    //
    // Returns:
    //
    // TODAY
    // PENDING
    //
    // Today = today's reminders including overdue
    //
    // Pending = tomorrow onward
    // =====================================================

    @GetMapping("/notifications")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<NotificationPageResponse>
    getNotificationPage() {

        return ResponseEntity.ok(
                reminderService.getNotificationPage()
        );
    }
}