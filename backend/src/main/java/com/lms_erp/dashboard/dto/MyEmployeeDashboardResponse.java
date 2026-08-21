package com.lms_erp.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyEmployeeDashboardResponse {

    private Long totalLeaves;

    private Long approvedLeaves;

    private Long pendingLeaves;

    private Long attendanceCount;
}