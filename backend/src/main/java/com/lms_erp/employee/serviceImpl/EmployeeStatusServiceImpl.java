package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.EmployeeStatusRequest;
import com.lms_erp.employee.dto.EmployeeStatusResponse;
import com.lms_erp.employee.entity.EmployeeStatusMaster;
import com.lms_erp.employee.mapper.EmployeeStatusMapper;
import com.lms_erp.employee.repository.EmployeeStatusRepository;
import com.lms_erp.employee.service.EmployeeStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class EmployeeStatusServiceImpl
        implements EmployeeStatusService {

    private final EmployeeStatusRepository employeeStatusRepository;
    private final EmployeeStatusMapper employeeStatusMapper;

    @Override
    @Transactional
    public EmployeeStatusResponse createEmployeeStatus(
            EmployeeStatusRequest request) {

        String statusName = request.getStatusName().trim();

        if (employeeStatusRepository.existsByStatusNameIgnoreCase(statusName)) {
            throw new RuntimeException("Employee status already exists");
        }

        EmployeeStatusMaster status =
                EmployeeStatusMaster.builder()
                        .statusName(statusName)
                        .build();

        return employeeStatusMapper.mapToResponse(
                employeeStatusRepository.save(status)
        );
    }

    @Override
    @Transactional
    public EmployeeStatusResponse updateEmployeeStatus(
            Long employeeStatusId,
            EmployeeStatusRequest request) {

        EmployeeStatusMaster status =
                employeeStatusRepository.findById(employeeStatusId)
                        .orElseThrow(() ->
                                new RuntimeException("Employee status not found"));

        String statusName = request.getStatusName().trim();

        if (!status.getStatusName().equalsIgnoreCase(statusName)
                && employeeStatusRepository.existsByStatusNameIgnoreCase(statusName)) {

            throw new RuntimeException("Employee status already exists");
        }

        status.setStatusName(statusName);

        return employeeStatusMapper.mapToResponse(
                employeeStatusRepository.save(status)
        );
    }
    @Override
    public EmployeeStatusResponse getEmployeeStatusById(
            Long employeeStatusId) {

        EmployeeStatusMaster status =
                employeeStatusRepository.findById(
                                employeeStatusId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee status not found"));

        return employeeStatusMapper.mapToResponse(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeStatusResponse> getAllEmployeeStatuses() {

        List<EmployeeStatusResponse> responses =
                new ArrayList<>();

        List<EmployeeStatusMaster> statuses =
                employeeStatusRepository.findAll();

        for (EmployeeStatusMaster status : statuses) {

            responses.add(
                    employeeStatusMapper.mapToResponse(status)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteEmployeeStatus(Long employeeStatusId) {

        EmployeeStatusMaster status =
                employeeStatusRepository.findById(employeeStatusId)
                        .orElseThrow(() ->
                                new RuntimeException("Employee status not found"));

        employeeStatusRepository.delete(status);
    }
}