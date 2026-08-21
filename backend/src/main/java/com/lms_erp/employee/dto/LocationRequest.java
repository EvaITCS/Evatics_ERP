package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationRequest {

    @NotBlank(message = "Location name is required")
    @Size(max = 200, message = "Location name cannot exceed 100 characters")
    private String locationName;

    @Size(max = 2000, message = "Address cannot exceed 2000 characters")
    private String address;
}