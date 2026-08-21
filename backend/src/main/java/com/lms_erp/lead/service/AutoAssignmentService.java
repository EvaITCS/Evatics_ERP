package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AutoAssignmentService {

    private final EmployeeRepository employeeRepository;
    private final LeadRepository leadRepository;

    /**
     * Returns the employee having the least number
     * of active assigned leads.
     */
    public Employee getLeastLoadedEmployee() {

        // =====================================
        // GET ALL COUNSELLOR EMPLOYEES
        // =====================================

        List<Employee> employees = employeeRepository.findAllCounsellors();

        if (employees.isEmpty()) {
            throw new RuntimeException(
                    "No employee available for lead assignment."
            );
        }

        // =====================================
        // LOAD CURRENT LEAD COUNTS
        // =====================================

        List<Object[]> counts = leadRepository.getEmployeeLeadCounts();

        Map<Long, Long> leadCountMap = new HashMap<>();

        for (Object[] row : counts) {

            leadCountMap.put(
                    ((Number) row[0]).longValue(),
                    ((Number) row[1]).longValue()
            );
        }

        // =====================================
        // FIND LEAST LOADED EMPLOYEE
        // =====================================

        Employee selectedEmployee = null;
        long minimumLeadCount = Long.MAX_VALUE;

        for (Employee employee : employees) {

            long totalLeads = leadCountMap.getOrDefault(
                    employee.getPersonId(),
                    0L
            );

            if (totalLeads < minimumLeadCount) {

                minimumLeadCount = totalLeads;
                selectedEmployee = employee;
            }
        }

        if (selectedEmployee == null) {

            throw new RuntimeException(
                    "Employee auto-assignment failed."
            );
        }

        return selectedEmployee;
    }
}