package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.HolidayRequest;
import com.lms_erp.employee.dto.HolidayResponse;
import com.lms_erp.employee.service.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class HolidayController {

    private final HolidayService holidayService;

    @PostMapping
    public HolidayResponse createHoliday(
            @RequestBody HolidayRequest request) {

        return holidayService.createHoliday(request);
    }

    @PutMapping("/{holidayId}")
    public HolidayResponse updateHoliday(
            @PathVariable Long holidayId,
            @RequestBody HolidayRequest request) {

        return holidayService.updateHoliday(holidayId, request);
    }

    @GetMapping("/{holidayId}")
    public HolidayResponse getHolidayById(
            @PathVariable Long holidayId) {

        return holidayService.getHolidayById(holidayId);
    }

    @GetMapping
    public List<HolidayResponse> getAllHolidays() {

        return holidayService.getAllHolidays();
    }

    @DeleteMapping("/{holidayId}")
    public String deleteHoliday(
            @PathVariable Long holidayId) {

        holidayService.deleteHoliday(holidayId);

        return "Holiday deleted successfully";
    }
}