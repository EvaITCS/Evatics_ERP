package com.lms_erp.employee.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {

    private Long locationId;

    private String locationName;

    private String address;
}