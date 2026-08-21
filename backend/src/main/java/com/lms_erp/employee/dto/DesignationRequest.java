package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationRequest {

    @NotBlank(message = "Designation name is required")
    @Size(max = 200, message = "Designation name cannot exceed 100 characters")
    private String designationName;

    @Size(max = 50, message = "Designation level cannot exceed 50 characters")
    private String designationLevel;

    @NotNull(message = "Role is required")
    private Long roleId;
}