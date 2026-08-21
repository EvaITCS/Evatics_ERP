package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLeaveRequestDto {

    @NotNull(message = "Employee is required")
    private Long personId;

    @NotNull(message = "Leave type is required")
    private Long leaveTypeId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    private String reason;
}