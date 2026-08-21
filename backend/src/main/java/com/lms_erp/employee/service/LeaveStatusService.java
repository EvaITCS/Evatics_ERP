package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.LeaveStatusRequest;
import com.lms_erp.employee.dto.LeaveStatusResponse;

import java.util.List;

public interface LeaveStatusService {

    LeaveStatusResponse createLeaveStatus(
            LeaveStatusRequest request);

    LeaveStatusResponse updateLeaveStatus(
            Long leaveStatusId,
            LeaveStatusRequest request);

    LeaveStatusResponse getLeaveStatusById(
            Long leaveStatusId);

    List<LeaveStatusResponse> getAllLeaveStatuses();

    void deleteLeaveStatus(Long leaveStatusId);
}