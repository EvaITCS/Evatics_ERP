package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.EmployeeDashboardResponse;
import com.lms_erp.employee.dto.EmployeeStatisticsResponse;
import com.lms_erp.employee.repository.DepartmentRepository;
import com.lms_erp.employee.repository.DesignationRepository;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.employee.service.EmployeeDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeDashboardServiceImpl
        implements EmployeeDashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;

    // =====================================================
    // DASHBOARD STATISTICS
    // =====================================================

    @Override
    public EmployeeDashboardResponse getDashboardStatistics() {

        return EmployeeDashboardResponse.builder()

                .totalEmployees(
                        employeeRepository.count()
                )

                .activeEmployees(
                        employeeRepository.countByEmployeeStatus_StatusName("ACTIVE")
                )

                .probationEmployees(
                        employeeRepository.countByEmployeeStatus_StatusName("PROBATION")
                )

                .onLeaveEmployees(
                        employeeRepository.countByEmployeeStatus_StatusName("ON_LEAVE")
                )

                .inactiveEmployees(
                        employeeRepository.countByEmployeeStatus_StatusName("TERMINATED")
                )

                .resignedEmployees(
                        employeeRepository.countByEmployeeStatus_StatusName("RESIGNED")
                )

                .totalDepartments(
                        departmentRepository.count()
                )

                .totalDesignations(
                        designationRepository.count()
                )

                .build();
    }

    // =====================================================
    // DEPARTMENT WISE STATS
    // =====================================================

    @Override
    public List<EmployeeStatisticsResponse> getDepartmentWiseEmployeeStats() {

        return List.of();
    }

    // =====================================================
    // EMPLOYEE STATUS STATS
    // =====================================================

    @Override
    public List<EmployeeStatisticsResponse> getEmployeeStatusStats() {

        return List.of();
    }
}