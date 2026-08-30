package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {

    // =====================================================
    // REMINDER
    // =====================================================

    private Long reminderId;

    private String reminderType;

    private LocalDateTime reminderTime;

    private Boolean completed;


    // =====================================================
    // FOLLOW-UP DETAILS
    // =====================================================

    private String actionResult;

    private LocalDateTime nextFollowupAt;


    // =====================================================
    // CALLBACK
    // =====================================================

    private LocalDateTime callbackScheduledAt;


    // =====================================================
    // LEAD / PERSON
    // =====================================================

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String phone;


    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    private Long employeePersonId;

    private String employeeName;


    // =====================================================
    // LEAD STATUS
    // =====================================================

    private String leadStatus;


    // =====================================================
    // HIGHEST / MOST URGENT PENDING REMINDER
    // =====================================================

    private Long highestPriorityReminderId;

    private LocalDateTime highestPriorityReminderTime;

    private String highestPriorityReminderType;


    // =====================================================
    // PENDING FOLLOW-UPS
    // =====================================================

    private Integer pendingCount;

    private List<PendingFollowupResponse> pendingFollowups;
}