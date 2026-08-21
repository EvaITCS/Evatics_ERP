package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.LeaveTypeRequest;
import com.lms_erp.employee.dto.LeaveTypeResponse;

import java.util.List;

public interface LeaveTypeService {

    LeaveTypeResponse createLeaveType(LeaveTypeRequest request);

    LeaveTypeResponse updateLeaveType(Long leaveTypeId,
                                      LeaveTypeRequest request);

    LeaveTypeResponse getLeaveTypeById(Long leaveTypeId);

    List<LeaveTypeResponse> getAllLeaveTypes();

    void deleteLeaveType(Long leaveTypeId);
}