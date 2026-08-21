package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.ShiftRequest;
import com.lms_erp.employee.dto.ShiftResponse;
import com.lms_erp.employee.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping
    public ShiftResponse createShift(
            @RequestBody ShiftRequest request) {

        return shiftService.createShift(request);
    }

    @PutMapping("/{shiftId}")
    public ShiftResponse updateShift(
            @PathVariable Long shiftId,
            @RequestBody ShiftRequest request) {

        return shiftService.updateShift(shiftId, request);
    }

    @GetMapping("/{shiftId}")
    public ShiftResponse getShiftById(
            @PathVariable Long shiftId) {

        return shiftService.getShiftById(shiftId);
    }

    @GetMapping
    public List<ShiftResponse> getAllShifts() {

        return shiftService.getAllShifts();
    }

    @DeleteMapping("/{shiftId}")
    public String deleteShift(@PathVariable Long shiftId) {

        shiftService.deleteShift(shiftId);

        return "Shift deleted successfully";
    }
}