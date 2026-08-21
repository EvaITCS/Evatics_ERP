package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.LeaveStatusResponse;
import com.lms_erp.employee.entity.LeaveStatusMaster;
import org.springframework.stereotype.Component;

@Component

public class LeaveStatusMapper {

    public LeaveStatusResponse mapToResponse(
            LeaveStatusMaster leaveStatus) {

        return LeaveStatusResponse.builder()
                .leaveStatusId(leaveStatus.getLeaveStatusId())
                .statusName(leaveStatus.getStatusName())
                .build();
    }
}