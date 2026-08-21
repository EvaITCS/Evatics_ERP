package com.lms_erp.student.dto;

import lombok.Data;
@Data
public class EducationRequest {

    private String qualification;

    private String instituteName;

    private String fieldOfStudy;

    private String passingYear;
}