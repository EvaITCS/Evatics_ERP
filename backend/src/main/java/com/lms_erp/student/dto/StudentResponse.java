package com.lms_erp.student.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private Long personId;

    private String name;

    private String email;
}