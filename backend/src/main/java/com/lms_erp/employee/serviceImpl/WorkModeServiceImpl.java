package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.WorkModeRequest;
import com.lms_erp.employee.dto.WorkModeResponse;
import com.lms_erp.employee.entity.WorkMode;
import com.lms_erp.employee.mapper.WorkModeMapper;
import com.lms_erp.employee.repository.WorkModeRepository;
import com.lms_erp.employee.service.WorkModeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class WorkModeServiceImpl implements WorkModeService {

    private final WorkModeRepository workModeRepository;
    private final WorkModeMapper workModeMapper;

    @Override
    @Transactional
    public WorkModeResponse createWorkMode(
            WorkModeRequest request) {

        String modeName = request.getModeName().trim();

        if (workModeRepository.existsByModeNameIgnoreCase(modeName)) {
            throw new RuntimeException("Work mode already exists");
        }

        WorkMode workMode = WorkMode.builder()
                .modeName(modeName)
                .build();

        return workModeMapper.mapToResponse(
                workModeRepository.save(workMode)
        );
    }

    @Override
    @Transactional
    public WorkModeResponse updateWorkMode(
            Long modeId,
            WorkModeRequest request) {

        WorkMode workMode =
                workModeRepository.findById(modeId)
                        .orElseThrow(() ->
                                new RuntimeException("Work mode not found"));

        String modeName = request.getModeName().trim();

        if (!workMode.getModeName().equalsIgnoreCase(modeName)
                && workModeRepository.existsByModeNameIgnoreCase(modeName)) {

            throw new RuntimeException("Work mode already exists");
        }

        workMode.setModeName(modeName);

        return workModeMapper.mapToResponse(
                workModeRepository.save(workMode)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public WorkModeResponse getWorkModeById(
            Long modeId) {

        WorkMode workMode =
                workModeRepository.findById(modeId)
                        .orElseThrow(() ->
                                new RuntimeException("Work mode not found"));

        return workModeMapper.mapToResponse(workMode);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkModeResponse> getAllWorkModes() {

        List<WorkModeResponse> responses =
                new ArrayList<>();

        List<WorkMode> workModes =
                workModeRepository.findAll();

        for (WorkMode workMode : workModes) {

            responses.add(
                    workModeMapper.mapToResponse(workMode)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteWorkMode(
            Long modeId) {

        WorkMode workMode =
                workModeRepository.findById(modeId)
                        .orElseThrow(() ->
                                new RuntimeException("Work mode not found"));

        workModeRepository.delete(workMode);
    }
}