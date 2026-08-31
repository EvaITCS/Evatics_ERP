package com.lms_erp.lead.controller;

import com.lms_erp.lead.dto.NotificationPageResponse;
import com.lms_erp.lead.dto.NotificationResponse;
import com.lms_erp.lead.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR','STUDENT','LEAD')")
public class NotificationController {

    private final NotificationService notificationService;


    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>>
    getUserNotifications() {

        return ResponseEntity.ok(
                notificationService.getUserNotifications()
        );
    }


    @GetMapping("/page")
    public ResponseEntity<NotificationPageResponse>
    getNotificationPage() {

        return ResponseEntity.ok(
                notificationService.getNotificationPage()
        );
    }


    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications() {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications()
        );
    }


    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String>
    markAsRead(
            @PathVariable Long notificationId
    ) {

        notificationService.markAsRead(
                notificationId
        );

        return ResponseEntity.ok(
                "Notification marked as read successfully."
        );
    }


    @GetMapping("/unread-count")
    public ResponseEntity<Long>
    getUnreadCount() {

        return ResponseEntity.ok(
                notificationService.getUnreadCount()
        );
    }
}
