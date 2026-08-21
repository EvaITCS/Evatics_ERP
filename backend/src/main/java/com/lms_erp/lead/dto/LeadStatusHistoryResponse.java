package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadStatusHistoryResponse {

    private Long historyId;

    private String oldStatusName;

    private String newStatusName;

    private String changedBy;

    private String remarks;

    private LocalDateTime changedAt;
}