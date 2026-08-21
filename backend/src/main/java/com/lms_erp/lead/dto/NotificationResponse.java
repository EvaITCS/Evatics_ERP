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

    private Long studentPersonId;

    private Boolean isRead;

    private LocalDateTime createdAt;
}