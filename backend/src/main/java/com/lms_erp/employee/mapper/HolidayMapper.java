package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.HolidayResponse;
import com.lms_erp.employee.entity.Holiday;
import org.springframework.stereotype.Component;

@Component

public class HolidayMapper {

    public HolidayResponse mapToResponse(Holiday holiday) {

        return HolidayResponse.builder()
                .holidayId(holiday.getHolidayId())
                .holidayName(holiday.getHolidayName())
                .holidayDate(holiday.getHolidayDate())
                .holidayType(holiday.getHolidayType())
                .build();
    }
}