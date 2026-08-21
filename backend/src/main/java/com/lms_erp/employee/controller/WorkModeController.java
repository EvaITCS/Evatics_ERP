package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.WorkModeRequest;
import com.lms_erp.employee.dto.WorkModeResponse;
import com.lms_erp.employee.service.WorkModeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-modes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class WorkModeController {

    private final WorkModeService workModeService;

    @PostMapping
    public WorkModeResponse createWorkMode(
            @RequestBody WorkModeRequest request) {

        return workModeService.createWorkMode(request);
    }

    @PutMapping("/{modeId}")
    public WorkModeResponse updateWorkMode(
            @PathVariable Long modeId,
            @RequestBody WorkModeRequest request) {

        return workModeService.updateWorkMode(modeId, request);
    }

    @GetMapping("/{modeId}")
    public WorkModeResponse getWorkModeById(
            @PathVariable Long modeId) {

        return workModeService.getWorkModeById(modeId);
    }

    @GetMapping
    public List<WorkModeResponse> getAllWorkModes() {

        return workModeService.getAllWorkModes();
    }

    @DeleteMapping("/{modeId}")
    public String deleteWorkMode(@PathVariable Long modeId) {

        workModeService.deleteWorkMode(modeId);

        return "Work mode deleted successfully";
    }
}