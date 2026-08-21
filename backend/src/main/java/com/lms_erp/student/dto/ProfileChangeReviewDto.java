package com.lms_erp.student.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileChangeReviewDto {

    private String action;

    private String rejectionReason;
}