package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.LeaveTypeResponse;
import com.lms_erp.employee.entity.LeaveType;
import org.springframework.stereotype.Component;

@Component

public class LeaveTypeMapper {

    public LeaveTypeResponse mapToResponse(LeaveType leaveType) {

        return LeaveTypeResponse.builder()
                .leaveTypeId(leaveType.getLeaveTypeId())
                .leaveTypeName(leaveType.getLeaveTypeName())
                .maxDaysAllowed(leaveType.getMaxDaysAllowed())
                .isPaid(leaveType.getIsPaid())
                .build();
    }
}