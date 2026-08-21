package com.lms_erp.program.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProgramResponse {

    private Long programId;

    private String programName;

    private String programCode;

    private String description;

    private Boolean isActive;

    private Integer durationValue;

    private String durationType;
}