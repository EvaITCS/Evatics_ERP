package com.lms_erp.trainer.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerStudentResponse {

    private Long studentPersonId;

    private String studentName;

    private String email;

    private String phone;

    private String gender;

    private String batchName;

    private String programName;

    private String applicationStage;

    private LocalDate admissionDate;
}