package com.lms_erp.person.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StateResponse {

    private Long stateId;
    private String stateName;
    private Long countryId;

}