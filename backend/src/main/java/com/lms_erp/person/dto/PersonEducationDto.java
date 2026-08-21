package com.lms_erp.person.dto;

import lombok.Data;

@Data
public class PersonEducationDto {

    private Long personEducationId;

    private String qualification;

    private String instituteName;

    private String fieldOfStudy;

    private Integer passingYear;
}