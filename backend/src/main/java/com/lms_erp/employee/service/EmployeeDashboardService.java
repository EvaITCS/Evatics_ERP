package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.EmployeeDashboardResponse;
import com.lms_erp.employee.dto.EmployeeStatisticsResponse;

import java.util.List;

public interface EmployeeDashboardService {

    EmployeeDashboardResponse getDashboardStatistics();

    List<EmployeeStatisticsResponse> getDepartmentWiseEmployeeStats();

    List<EmployeeStatisticsResponse> getEmployeeStatusStats();
}