package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.DepartmentRequest;
import com.lms_erp.employee.dto.DepartmentResponse;
import com.lms_erp.employee.entity.Department;
import com.lms_erp.employee.exception.DepartmentNotFoundException;
import com.lms_erp.employee.repository.DepartmentRepository;
import com.lms_erp.employee.service.DepartmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    // =====================================================
    // CREATE DEPARTMENT
    // =====================================================

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {

        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new IllegalArgumentException("Department already exists.");
        }

        Department department = Department.builder()
                .departmentName(request.getDepartmentName())
                .description(request.getDescription())
                .build();

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponse(savedDepartment);
    }

    // =====================================================
    // UPDATE DEPARTMENT
    // =====================================================

    @Override
    public DepartmentResponse updateDepartment(Long departmentId,
                                               DepartmentRequest request) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id : " + departmentId));

        departmentRepository.findByDepartmentName(request.getDepartmentName())
                .ifPresent(existing -> {
                    if (!existing.getDepartmentId().equals(departmentId)) {
                        throw new IllegalArgumentException("Department already exists.");
                    }
                });

        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());

        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponse(updatedDepartment);
    }

    // =====================================================
    // GET DEPARTMENT BY ID
    // =====================================================

    @Override
    @Transactional
    public DepartmentResponse getDepartmentById(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id : " + departmentId));

        return mapToResponse(department);
    }

    // =====================================================
    // GET ALL DEPARTMENTS
    // =====================================================

    @Override
    @Transactional
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // DELETE DEPARTMENT
    // =====================================================

    @Override
    public void deleteDepartment(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found with id : " + departmentId));

        departmentRepository.delete(department);
    }

    // =====================================================
    // ENTITY -> RESPONSE MAPPER
    // =====================================================

    private DepartmentResponse mapToResponse(Department department) {

        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId())
                .departmentName(department.getDepartmentName())
                .description(department.getDescription())
                .build();
    }
}