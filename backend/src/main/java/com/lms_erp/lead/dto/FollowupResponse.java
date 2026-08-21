package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowupResponse {

    // =====================================================
    // FOLLOW-UP
    // =====================================================

    private Long followupId;

    // =====================================================
    // LEAD (PERSON)
    // =====================================================

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String phone;

    // =====================================================
    // STATUS
    // =====================================================

    private String leadStatus;

    private String followupType;

    private String followupStatus;

    // =====================================================
    // FOLLOW-UP DETAILS
    // =====================================================

    private String remarks;

    private LocalDateTime scheduledAt;

    private LocalDateTime nextFollowupAt;

    private Integer retryCount;

    // =====================================================
    // EMPLOYEE WHO HANDLED FOLLOW-UP
    // =====================================================

    private Long employeePersonId;

    private String employeeName;

    // =====================================================
    // AUDIT
    // =====================================================

    private LocalDateTime createdAt;
}