package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.LeaveTypeRequest;
import com.lms_erp.employee.dto.LeaveTypeResponse;
import com.lms_erp.employee.entity.LeaveType;
import com.lms_erp.employee.mapper.LeaveTypeMapper;
import com.lms_erp.employee.repository.LeaveTypeRepository;
import com.lms_erp.employee.service.LeaveTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class LeaveTypeServiceImpl implements LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveTypeMapper leaveTypeMapper;

    @Override
    @Transactional
    public LeaveTypeResponse createLeaveType(
            LeaveTypeRequest request) {

        String leaveTypeName = request.getLeaveTypeName().trim();

        if (leaveTypeRepository.existsByLeaveTypeNameIgnoreCase(leaveTypeName)) {
            throw new RuntimeException("Leave type already exists");
        }

        LeaveType leaveType = LeaveType.builder()
                .leaveTypeName(leaveTypeName)
                .maxDaysAllowed(request.getMaxDaysAllowed())
                .isPaid(request.getIsPaid())
                .build();

        return leaveTypeMapper.mapToResponse(
                leaveTypeRepository.save(leaveType)
        );
    }

    @Override
    @Transactional
    public LeaveTypeResponse updateLeaveType(
            Long leaveTypeId,
            LeaveTypeRequest request) {

        LeaveType leaveType =
                leaveTypeRepository.findById(leaveTypeId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave type not found"));

        String leaveTypeName = request.getLeaveTypeName().trim();

        if (!leaveType.getLeaveTypeName().equalsIgnoreCase(leaveTypeName)
                && leaveTypeRepository.existsByLeaveTypeNameIgnoreCase(leaveTypeName)) {

            throw new RuntimeException("Leave type already exists");
        }

        leaveType.setLeaveTypeName(leaveTypeName);
        leaveType.setMaxDaysAllowed(request.getMaxDaysAllowed());
        leaveType.setIsPaid(request.getIsPaid());

        return leaveTypeMapper.mapToResponse(
                leaveTypeRepository.save(leaveType)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveTypeResponse getLeaveTypeById(
            Long leaveTypeId) {

        LeaveType leaveType =
                leaveTypeRepository.findById(leaveTypeId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave type not found"));

        return leaveTypeMapper.mapToResponse(leaveType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getAllLeaveTypes() {

        List<LeaveTypeResponse> responses =
                new ArrayList<>();

        List<LeaveType> leaveTypes =
                leaveTypeRepository.findAll();

        for (LeaveType leaveType : leaveTypes) {

            responses.add(
                    leaveTypeMapper.mapToResponse(leaveType)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteLeaveType(Long leaveTypeId) {

        LeaveType leaveType =
                leaveTypeRepository.findById(leaveTypeId)
                        .orElseThrow(() ->
                                new RuntimeException("Leave type not found"));

        leaveTypeRepository.delete(leaveType);
    }
}