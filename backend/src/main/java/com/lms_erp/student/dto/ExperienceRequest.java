package com.lms_erp.student.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceRequest {

    private String companyName;

    private String designation;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean currentlyWorking;
}