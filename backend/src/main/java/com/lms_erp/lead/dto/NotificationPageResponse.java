package com.lms_erp.lead.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPageResponse {

    // =====================================================
    // TODAY
    // =====================================================

    private List<ReminderResponse> today;


    // =====================================================
    // PENDING
    // =====================================================

    private List<ReminderResponse> pending;


    // =====================================================
    // NOTIFICATIONS
    //
    // Includes normal notifications and
    // ADMIN 48-hour escalation notifications.
    // =====================================================

    private List<NotificationResponse> notifications;

}