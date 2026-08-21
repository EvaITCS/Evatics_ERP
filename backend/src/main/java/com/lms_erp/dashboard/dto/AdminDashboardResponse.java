package com.lms_erp.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    // Lead Statistics
    private Long totalLeads;
    private Long newLeads;
    private Long interestedLeads;
    private Long insertedLeads;
    private Long convertedLeads;
    private Long callbackLeads;
    private Long closedLeads;
    private Long notInterestedLeads;
    private Long reEngagementLeads;

    // Employee Statistics
    private Long totalEmployees;
    private Long activeEmployees;
    private Long inactiveEmployees;

    // Masters
    private Long totalDepartments;
    private Long totalDesignations;
}