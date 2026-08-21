package com.lms_erp.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HolidayRequest {

    @NotBlank(message = "Holiday name is required")
    @Size(max = 100, message = "Holiday name cannot exceed 100 characters")
    private String holidayName;

    @NotNull(message = "Holiday date is required")
    private LocalDate holidayDate;

    @NotBlank(message = "Holiday type is required")
    @Size(max = 50, message = "Holiday type cannot exceed 50 characters")
    private String holidayType;
}