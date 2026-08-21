package com.lms_erp.employee.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeActivityLogResponse {

    private Long activityLogId;

    private Long personId;

    private String employeeName;

    private String activityType;

    private String activityDescription;

    private Long createdByPersonId;

    private String createdBy;

    private LocalDateTime createdAt;
}