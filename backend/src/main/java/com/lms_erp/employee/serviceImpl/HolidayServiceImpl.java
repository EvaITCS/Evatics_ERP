package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.HolidayRequest;
import com.lms_erp.employee.dto.HolidayResponse;
import com.lms_erp.employee.entity.Holiday;
import com.lms_erp.employee.mapper.HolidayMapper;
import com.lms_erp.employee.repository.HolidayRepository;
import com.lms_erp.employee.service.HolidayService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class HolidayServiceImpl implements HolidayService {

    private final HolidayRepository holidayRepository;
    private final HolidayMapper holidayMapper;

    @Override

    @Transactional
    public HolidayResponse createHoliday(
            HolidayRequest request) {

        if (holidayRepository.existsByHolidayDate(
                request.getHolidayDate())) {

            throw new RuntimeException(
                    "Holiday already exists for this date");
        }

        Holiday holiday = Holiday.builder()
                .holidayName(request.getHolidayName().trim())
                .holidayDate(request.getHolidayDate())
                .holidayType(request.getHolidayType())
                .build();

        return holidayMapper.mapToResponse(
                holidayRepository.save(holiday)
        );
    }
    @Override
    @Transactional
    public HolidayResponse updateHoliday(
            Long holidayId,
            HolidayRequest request) {

        Holiday holiday = holidayRepository.findById(holidayId)
                .orElseThrow(() ->
                        new RuntimeException("Holiday not found"));

        String holidayName = request.getHolidayName().trim();

        if (!holiday.getHolidayDate().equals(request.getHolidayDate())
                && holidayRepository.existsByHolidayDate(request.getHolidayDate())) {

            throw new RuntimeException(
                    "Holiday already exists for this date");
        }

        holiday.setHolidayName(holidayName);
        holiday.setHolidayDate(request.getHolidayDate());
        holiday.setHolidayType(request.getHolidayType());

        return holidayMapper.mapToResponse(
                holidayRepository.save(holiday)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public HolidayResponse getHolidayById(
            Long holidayId) {

        Holiday holiday =
                holidayRepository.findById(holidayId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Holiday not found"));

        return holidayMapper.mapToResponse(holiday);
    }
    @Override
    @Transactional(readOnly = true)
    public List<HolidayResponse> getAllHolidays() {

        List<HolidayResponse> responses =
                new ArrayList<>();

        List<Holiday> holidays =
                holidayRepository.findAll();

        for (Holiday holiday : holidays) {

            responses.add(
                    holidayMapper.mapToResponse(holiday)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteHoliday(Long holidayId) {

        Holiday holiday =
                holidayRepository.findById(holidayId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Holiday not found"));

        holidayRepository.delete(holiday);
    }

}