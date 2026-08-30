package com.lms_erp.lead.dto;

import com.lms_erp.lead.enums.FollowupType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FollowupRequest {

    // =====================================================
    // LEAD (PERSON)
    // =====================================================

    @NotNull(message = "Person ID is required")
    private Long personId;


    // =====================================================
    // EMPLOYEE WHO PERFORMED FOLLOW-UP
    // =====================================================

    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;


    // =====================================================
    // FOLLOW-UP TYPE
    // =====================================================

    @NotNull(message = "Follow-up type is required")
    private FollowupType followupType;


    // =====================================================
    // ACTION RESULT
    // =====================================================

    @NotNull(message = "Action result is required")
    private String actionResult;


    // =====================================================
    // REMARKS
    // =====================================================

    private String remarks;


    // =====================================================
    // RE-ENGAGEMENT DATE
    // =====================================================

    private LocalDateTime reEngagementDate;


    // =====================================================
    // CALLBACK SCHEDULE
    // =====================================================
    //
    // Only required when:
    //
    // actionResult = CALLBACK_REQUESTED
    //
    // Example:
    //
    // 2026-08-29 17:00
    //
    // =====================================================

    private LocalDateTime callbackScheduledAt;

    // =====================================================
// NEXT FOLLOW-UP SCHEDULE
// =====================================================
//
// Used when:
// actionResult = SMS_REPLIED
//
// Counsellor can select a future date/time
// for the next follow-up.
//
// Example:
// 2026-08-30 15:00
// =====================================================

    private LocalDateTime nextFollowupAt;
}