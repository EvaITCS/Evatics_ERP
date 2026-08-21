package com.lms_erp.person.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class PersonWorkExperienceDto {

    private Long experienceId;

    private String companyName;
    private String designation;

    private LocalDate startDate;
    private LocalDate endDate;

    private Boolean currentlyWorking;

    private String skillsUsed;

    private String jobDescription;


}