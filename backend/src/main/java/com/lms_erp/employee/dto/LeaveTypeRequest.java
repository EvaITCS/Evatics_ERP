package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    @Size(max = 100, message = "Leave type name cannot exceed 100 characters")
    private String leaveTypeName;

    @PositiveOrZero(message = "Maximum allowed days cannot be negative")
    private Integer maxDaysAllowed;

    @NotNull(message = "Paid status is required")
    private Boolean isPaid;
}