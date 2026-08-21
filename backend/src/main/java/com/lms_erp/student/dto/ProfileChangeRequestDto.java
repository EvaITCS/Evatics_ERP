package com.lms_erp.student.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileChangeRequestDto {

    private Long requestId;

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String requestType;

    private String operationType;

    private Long targetId;

    private String newData;

    private String status;

    private String rejectionReason;
}