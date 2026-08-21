package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(
            CreateEmployeeRequest request,
            List<MultipartFile> documents
    );

    EmployeeResponse updateEmployee(
            Long employeeId,
            UpdateEmployeeRequest request,
            List<MultipartFile> documents
    );

    EmployeeProfileResponse getEmployeeById(Long employeeId);

    List<EmployeeResponse> getAllEmployees();

    void deleteEmployee(Long employeeId);

    EmployeeProfileResponse getMyProfile();

    List<CounsellorDropdownResponse> getCounsellorDropdown();
}