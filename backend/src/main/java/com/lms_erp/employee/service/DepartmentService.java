package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.DepartmentRequest;
import com.lms_erp.employee.dto.DepartmentResponse;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    DepartmentResponse updateDepartment(Long departmentId,
                                        DepartmentRequest request);

    DepartmentResponse getDepartmentById(Long departmentId);

    List<DepartmentResponse> getAllDepartments();

    void deleteDepartment(Long departmentId);
}