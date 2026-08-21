package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class LeaveStatusResponse {

    private Long leaveStatusId;

    private String statusName;
}