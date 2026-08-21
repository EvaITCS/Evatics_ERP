package com.lms_erp.program.mapper;

import com.lms_erp.program.dto.ProgramResponse;
import com.lms_erp.program.entity.Program;

public class ProgramMapper {

    public static ProgramResponse mapToResponse(Program program) {

        return ProgramResponse.builder()
                .programId(program.getProgramId())
                .programName(program.getProgramName())
                .programCode(program.getProgramCode())
                .description(program.getDescription())
                .isActive(program.getIsActive())
                .durationValue(program.getDurationValue())
                .durationType(program.getDurationType())
                .build();
    }
}