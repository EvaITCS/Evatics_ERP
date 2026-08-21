package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.HolidayRequest;
import com.lms_erp.employee.dto.HolidayResponse;

import java.util.List;

public interface HolidayService {

    HolidayResponse createHoliday(HolidayRequest request);

    HolidayResponse updateHoliday(Long holidayId,
                                  HolidayRequest request);

    HolidayResponse getHolidayById(Long holidayId);

    List<HolidayResponse> getAllHolidays();

    void deleteHoliday(Long holidayId);
}