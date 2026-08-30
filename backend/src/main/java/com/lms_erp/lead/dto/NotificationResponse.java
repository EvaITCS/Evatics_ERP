package com.lms_erp.lead.dto;

import com.lms_erp.lead.enums.NotificationType;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long notificationId;

    private String title;

    private String message;

    private NotificationType notificationType;

    private Long leadPersonId;


    // =====================================================
    // FOLLOW-UP
    // =====================================================

    private Long followupId;

    private Long studentPersonId;


    // =====================================================
    // SMS / FOLLOW-UP DETAILS
    // =====================================================

    private String actionResult;

    private LocalDateTime nextFollowupAt;

    private LocalDateTime callbackScheduledAt;


    // =====================================================
    // READ STATUS
    // =====================================================

    private Boolean isRead;


    // =====================================================
    // CREATED AT
    // =====================================================

    private LocalDateTime createdAt;
}