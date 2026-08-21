package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DesignationResponse {

    private Long designationId;

    private String designationName;

    private String designationLevel;

    private String roleName;
}