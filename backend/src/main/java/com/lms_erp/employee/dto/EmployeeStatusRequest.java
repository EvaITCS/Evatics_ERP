package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeStatusRequest {

    @NotBlank(message = "Status name is required")
    @Size(max = 50, message = "Status name cannot exceed 50 characters")
    private String statusName;
}