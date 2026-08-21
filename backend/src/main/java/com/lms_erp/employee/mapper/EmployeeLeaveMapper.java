package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.EmployeeLeaveResponseDto;
import com.lms_erp.employee.entity.EmployeeLeaveRequest;
import org.springframework.stereotype.Component;

@Component

public class EmployeeLeaveMapper {

    public EmployeeLeaveResponseDto mapToResponse(
            EmployeeLeaveRequest leaveRequest) {

        return EmployeeLeaveResponseDto.builder()

                .leaveRequestId(leaveRequest.getLeaveRequestId())

                .employeeName(
                        leaveRequest.getEmployee() != null
                                && leaveRequest.getEmployee().getPerson() != null
                                ? java.util.stream.Stream.of(
                                leaveRequest.getEmployee().getPerson().getFirstName(),
                                leaveRequest.getEmployee().getPerson().getMiddleName(),
                                leaveRequest.getEmployee().getPerson().getLastName()
                        )
                                  .filter(java.util.Objects::nonNull)
                                  .filter(s -> !s.isBlank())
                                  .collect(java.util.stream.Collectors.joining(" "))
                                : null
                )

                .leaveType(
                        leaveRequest.getLeaveType() != null
                                ? leaveRequest.getLeaveType()
                                  .getLeaveTypeName()
                                : null
                )

                .leaveStatus(
                        leaveRequest.getLeaveStatus() != null
                                ? leaveRequest.getLeaveStatus()
                                  .getStatusName()
                                : null
                )

                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())

                .reason(leaveRequest.getReason())

                .approvedBy(
                        leaveRequest.getApprovedBy() != null
                                && leaveRequest.getApprovedBy().getPerson() != null
                                ? java.util.stream.Stream.of(
                                leaveRequest.getApprovedBy().getPerson().getFirstName(),
                                leaveRequest.getApprovedBy().getPerson().getMiddleName(),
                                leaveRequest.getApprovedBy().getPerson().getLastName()
                        )
                                  .filter(java.util.Objects::nonNull)
                                  .filter(s -> !s.isBlank())
                                  .collect(java.util.stream.Collectors.joining(" "))
                                : null
                )

                .approvedAt(leaveRequest.getApprovedAt())
                .appliedAt(leaveRequest.getAppliedAt())

                .build();
    }
}