package com.lms_erp.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummaryResponse {

    private Long totalLeads;

    private Long interestedLeads;

    private Long convertedLeads;

    private Long callbackLeads;

    private Long newLeads;

    private Long reEngagementLeads;
}