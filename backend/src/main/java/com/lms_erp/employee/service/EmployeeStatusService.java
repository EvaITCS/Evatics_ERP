package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.EmployeeStatusRequest;
import com.lms_erp.employee.dto.EmployeeStatusResponse;

import java.util.List;

public interface EmployeeStatusService {

    EmployeeStatusResponse createEmployeeStatus(
            EmployeeStatusRequest request);

    EmployeeStatusResponse updateEmployeeStatus(
            Long employeeStatusId,
            EmployeeStatusRequest request);

    EmployeeStatusResponse getEmployeeStatusById(
            Long employeeStatusId);

    List<EmployeeStatusResponse> getAllEmployeeStatuses();

    void deleteEmployeeStatus(Long employeeStatusId);
}