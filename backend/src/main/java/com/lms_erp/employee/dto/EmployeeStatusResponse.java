package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EmployeeStatusResponse {

    private Long employeeStatusId;

    private String statusName;
}