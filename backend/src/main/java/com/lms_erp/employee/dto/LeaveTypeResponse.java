package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveTypeResponse {

    private Long leaveTypeId;

    private String leaveTypeName;

    private Integer maxDaysAllowed;

    private Boolean isPaid;
}