package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(max = 200, message = "Department name cannot exceed 100 characters")
    private String departmentName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}