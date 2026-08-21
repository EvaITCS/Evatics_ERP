package com.lms_erp.lead.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadSourceResponse {

    private Long sourceId;

    private String sourceName;

}