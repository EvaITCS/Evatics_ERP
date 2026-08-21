package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.WorkModeResponse;
import com.lms_erp.employee.entity.WorkMode;
import org.springframework.stereotype.Component;

@Component

public class WorkModeMapper {

    public WorkModeResponse mapToResponse(WorkMode workMode) {

        return WorkModeResponse.builder()
                .modeId(workMode.getModeId())
                .modeName(workMode.getModeName())
                .build();
    }
}