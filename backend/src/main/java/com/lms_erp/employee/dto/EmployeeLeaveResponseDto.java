package com.lms_erp.employee.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLeaveResponseDto {

    private Long leaveRequestId;

    private Long personId;

    private String employeeName;

    private String leaveType;

    private String leaveStatus;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer totalDays;

    private String reason;

    private Long approvedByPersonId;

    private String approvedBy;

    private LocalDateTime approvedAt;

    private LocalDateTime appliedAt;
}