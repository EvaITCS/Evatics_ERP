package com.lms_erp.employee.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HolidayResponse {

    private Long holidayId;

    private String holidayName;

    private LocalDate holidayDate;

    private String holidayType;
}