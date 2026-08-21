package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.EmployeeStatusResponse;
import com.lms_erp.employee.entity.EmployeeStatusMaster;
import org.springframework.stereotype.Component;

@Component

public class EmployeeStatusMapper {

    public EmployeeStatusResponse mapToResponse(
            EmployeeStatusMaster status) {

        return EmployeeStatusResponse.builder()
                .employeeStatusId(status.getEmployeeStatusId())
                .statusName(status.getStatusName())
                .build();
    }
}