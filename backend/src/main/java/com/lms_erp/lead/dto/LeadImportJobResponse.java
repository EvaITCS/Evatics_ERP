package com.lms_erp.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadImportJobResponse {

    private Long importJobId;

    private String originalFileName;

    private String status;

    private Integer totalRecords;

    private Integer duplicateRecords;

    private Integer invalidRecords;

    private Integer finalRecords;
}