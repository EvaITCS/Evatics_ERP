package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.ShiftResponse;
import com.lms_erp.employee.entity.Shift;
import org.springframework.stereotype.Component;

@Component

public class ShiftMapper {

    public ShiftResponse mapToResponse(Shift shift) {

        return ShiftResponse.builder()
                .shiftId(shift.getShiftId())
                .shiftName(shift.getShiftName())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .isActive(shift.getIsActive())
                .build();
    }
}