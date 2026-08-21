package com.lms_erp.program.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProgramUpdateRequest {

    private String programName;

    private Integer durationValue;

    private String durationType;

    private String description;

    private Boolean isActive;
}