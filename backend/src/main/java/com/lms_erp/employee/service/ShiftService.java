package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.ShiftRequest;
import com.lms_erp.employee.dto.ShiftResponse;

import java.util.List;

public interface ShiftService {

    ShiftResponse createShift(ShiftRequest request);

    ShiftResponse updateShift(Long shiftId,
                              ShiftRequest request);

    ShiftResponse getShiftById(Long shiftId);

    List<ShiftResponse> getAllShifts();

    void deleteShift(Long shiftId);
}