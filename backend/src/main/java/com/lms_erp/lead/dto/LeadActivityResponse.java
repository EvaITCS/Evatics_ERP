package com.lms_erp.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadActivityResponse {

    private Long logId;

    private String communicationType;

    private String communicationStatus;

    private String remarks;

    private LocalDateTime communicationTime;

    private Long employeePersonId;

    private String employeeName;
}
