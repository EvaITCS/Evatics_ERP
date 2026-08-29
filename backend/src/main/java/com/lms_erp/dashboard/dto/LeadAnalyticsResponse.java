package com.lms_erp.dashboard.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadAnalyticsResponse {

    private Long totalLeads;

    private Long newLeads;

    private Long interestedLeads;

    private Long notInterestedLeads;

    private Long convertedLeads;

    private Long callbackLeads;

    private Long reEngagementLeads;
}