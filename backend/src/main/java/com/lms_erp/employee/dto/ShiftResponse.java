package com.lms_erp.employee.dto;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftResponse {

    private Long shiftId;

    private String shiftName;

    private LocalTime startTime;

    private LocalTime endTime;

    private Boolean isActive;
}