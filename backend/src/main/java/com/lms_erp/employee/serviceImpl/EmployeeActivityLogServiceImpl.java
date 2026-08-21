package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.EmployeeActivityLogResponse;
import com.lms_erp.employee.mapper.EmployeeActivityLogMapper;
import com.lms_erp.employee.repository.EmployeeActivityLogRepository;
import com.lms_erp.employee.service.EmployeeActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeActivityLogServiceImpl
        implements EmployeeActivityLogService {

    private final EmployeeActivityLogRepository activityLogRepository;

    private final EmployeeActivityLogMapper activityLogMapper;

    @Override
    public List<EmployeeActivityLogResponse> getEmployeeActivityLogs(Long personId) {

        return activityLogRepository
                .findByEmployeePersonIdOrderByCreatedAtDesc(personId)
                .stream()
                .map(activityLogMapper::mapToResponse)
                .toList();
    }
}