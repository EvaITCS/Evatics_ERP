package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.EmployeeLeaveRequestDto;
import com.lms_erp.employee.dto.EmployeeLeaveResponseDto;

import java.util.List;

public interface EmployeeLeaveService {

    EmployeeLeaveResponseDto applyLeave(EmployeeLeaveRequestDto request);

    EmployeeLeaveResponseDto approveLeave(
            Long leaveRequestId,
            String username);

    EmployeeLeaveResponseDto rejectLeave(
            Long leaveRequestId,
            String username);

    List<EmployeeLeaveResponseDto> getLeavesByEmployee(Long employeeId);

    List<EmployeeLeaveResponseDto> getAllLeaveRequests();
}