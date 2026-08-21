package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.WorkModeRequest;
import com.lms_erp.employee.dto.WorkModeResponse;

import java.util.List;

public interface WorkModeService {

    WorkModeResponse createWorkMode(WorkModeRequest request);

    WorkModeResponse updateWorkMode(Long modeId,
                                    WorkModeRequest request);

    WorkModeResponse getWorkModeById(Long modeId);

    List<WorkModeResponse> getAllWorkModes();

    void deleteWorkMode(Long modeId);
}