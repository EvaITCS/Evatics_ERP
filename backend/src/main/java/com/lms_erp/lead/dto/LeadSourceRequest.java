package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadSourceRequest {

    @NotBlank(message = "Source name is required")
    private String sourceName;

}