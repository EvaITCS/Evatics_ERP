package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDashboardResponse {

    private Long totalEmployees;

    private Long activeEmployees;

    private Long probationEmployees;

    private Long onLeaveEmployees;
    private Long  inactiveEmployees;



    private Long resignedEmployees;

    private Long totalDepartments;

    private Long totalDesignations;
}