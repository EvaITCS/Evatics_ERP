package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.LeaveStatusRequest;
import com.lms_erp.employee.dto.LeaveStatusResponse;
import com.lms_erp.employee.entity.LeaveStatusMaster;
import com.lms_erp.employee.mapper.LeaveStatusMapper;
import com.lms_erp.employee.repository.LeaveStatusRepository;
import com.lms_erp.employee.service.LeaveStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class LeaveStatusServiceImpl
        implements LeaveStatusService {

    private final LeaveStatusRepository leaveStatusRepository;
    private final LeaveStatusMapper leaveStatusMapper;

    @Override
    @Transactional
    public LeaveStatusResponse createLeaveStatus(
            LeaveStatusRequest request) {

        String statusName = request.getStatusName().trim();

        if (leaveStatusRepository.existsByStatusNameIgnoreCase(statusName)) {
            throw new RuntimeException("Leave status already exists");
        }

        LeaveStatusMaster leaveStatus =
                LeaveStatusMaster.builder()
                        .statusName(statusName)
                        .build();

        return leaveStatusMapper.mapToResponse(
                leaveStatusRepository.save(leaveStatus)
        );
    }

    @Override
    @Transactional
    public LeaveStatusResponse updateLeaveStatus(
            Long leaveStatusId,
            LeaveStatusRequest request) {

        LeaveStatusMaster leaveStatus =
                leaveStatusRepository.findById(leaveStatusId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave status not found"));

        String statusName = request.getStatusName().trim();

        if (!leaveStatus.getStatusName().equalsIgnoreCase(statusName)
                && leaveStatusRepository.existsByStatusNameIgnoreCase(statusName)) {

            throw new RuntimeException("Leave status already exists");
        }

        leaveStatus.setStatusName(statusName);

        return leaveStatusMapper.mapToResponse(
                leaveStatusRepository.save(leaveStatus)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveStatusResponse getLeaveStatusById(
            Long leaveStatusId) {

        LeaveStatusMaster leaveStatus =
                leaveStatusRepository.findById(leaveStatusId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave status not found"));

        return leaveStatusMapper.mapToResponse(leaveStatus);
    }
    @Override
    @Transactional(readOnly = true)
    public List<LeaveStatusResponse> getAllLeaveStatuses() {

        List<LeaveStatusResponse> responses =
                new ArrayList<>();

        List<LeaveStatusMaster> leaveStatuses =
                leaveStatusRepository.findAll();

        for (LeaveStatusMaster leaveStatus : leaveStatuses) {

            responses.add(
                    leaveStatusMapper.mapToResponse(leaveStatus)
            );
        }

        return responses;
    }
    @Override
    @Transactional
    public void deleteLeaveStatus(Long leaveStatusId) {

        LeaveStatusMaster leaveStatus =
                leaveStatusRepository.findById(leaveStatusId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave status not found"));

        leaveStatusRepository.delete(leaveStatus);
    }
}