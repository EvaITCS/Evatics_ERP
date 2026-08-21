package com.lms_erp.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounsellorDashboardResponse {

    // =====================================================
    // LEADS
    // =====================================================

    private Long totalLeads;

    private Long newLeads;

    private Long interestedLeads;

    private Long convertedLeads;

    private Long callbackLeads;

    private Long closedLeads;

    private Long insertedLeads;


    // =====================================================
    // FOLLOWUPS
    // =====================================================

    private Long followupsToday;

    private Long pendingFollowups;

    private Long overdueFollowups;


    // =====================================================
    // COMMUNICATION
    // =====================================================

    private Long totalCalls;

    private Long totalEmails;

    private Long totalSms;


    // =====================================================
    // EMAIL
    // =====================================================

    private Long emailsSent;

    private Long emailsReplied;


    // =====================================================
    // CONVERSION
    // =====================================================

    private Double conversionRate;
}