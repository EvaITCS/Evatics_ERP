package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.EmployeeActivityLogResponse;

import java.util.List;

public interface EmployeeActivityLogService {

    List<EmployeeActivityLogResponse> getEmployeeActivityLogs(Long personId);

}