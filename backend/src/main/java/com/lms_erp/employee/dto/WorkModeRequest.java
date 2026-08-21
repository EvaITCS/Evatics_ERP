package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkModeRequest {

    @NotBlank(message = "Work mode name is required")
    @Size(max = 100, message = "Work mode name cannot exceed 50 characters")
    private String modeName;
}