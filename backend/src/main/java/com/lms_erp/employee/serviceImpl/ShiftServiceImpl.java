package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.ShiftRequest;
import com.lms_erp.employee.dto.ShiftResponse;
import com.lms_erp.employee.entity.Shift;
import com.lms_erp.employee.mapper.ShiftMapper;
import com.lms_erp.employee.repository.ShiftRepository;
import com.lms_erp.employee.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftMapper shiftMapper;

    @Override
    @Transactional
    public ShiftResponse createShift(
            ShiftRequest request) {

        String shiftName = request.getShiftName().trim();

        if (shiftRepository.existsByShiftNameIgnoreCase(shiftName)) {
            throw new RuntimeException("Shift already exists");
        }

        Shift shift = Shift.builder()
                .shiftName(shiftName)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .isActive(request.getIsActive())
                .build();

        return shiftMapper.mapToResponse(
                shiftRepository.save(shift)
        );
    }

    @Override
    @Transactional
    public ShiftResponse updateShift(
            Long shiftId,
            ShiftRequest request) {

        Shift shift =
                shiftRepository.findById(shiftId)
                        .orElseThrow(() ->
                                new RuntimeException("Shift not found"));

        String shiftName = request.getShiftName().trim();

        if (!shift.getShiftName().equalsIgnoreCase(shiftName)
                && shiftRepository.existsByShiftNameIgnoreCase(shiftName)) {

            throw new RuntimeException("Shift already exists");
        }

        shift.setShiftName(shiftName);
        shift.setStartTime(request.getStartTime());
        shift.setEndTime(request.getEndTime());
        shift.setIsActive(request.getIsActive());

        return shiftMapper.mapToResponse(
                shiftRepository.save(shift)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ShiftResponse getShiftById(
            Long shiftId) {

        Shift shift =
                shiftRepository.findById(shiftId)
                        .orElseThrow(() ->
                                new RuntimeException("Shift not found"));

        return shiftMapper.mapToResponse(shift);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShiftResponse> getAllShifts() {

        List<ShiftResponse> responses =
                new ArrayList<>();

        List<Shift> shifts =
                shiftRepository.findAll();

        for (Shift shift : shifts) {

            responses.add(
                    shiftMapper.mapToResponse(shift)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteShift(
            Long shiftId) {

        Shift shift =
                shiftRepository.findById(shiftId)
                        .orElseThrow(() ->
                                new RuntimeException("Shift not found"));

        shiftRepository.delete(shift);
    }
}