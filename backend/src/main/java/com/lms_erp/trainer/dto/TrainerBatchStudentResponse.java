package com.lms_erp.trainer.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerBatchStudentResponse {

    // Student Batch
    private Long studentBatchId;

    // Student
    private Long studentPersonId;

    private String studentName;

    private String phone;

    private String email;

    // Address
    private String city;

    private String state;

    // Education
    private String highestEducation;

    // Program & Stage
    private String programName;

    private String applicationStage;
    private String enrollmentNumber;
    // Completion / Drop Details
    private LocalDate completedDate;

    private LocalDate droppedDate;

    private String dropReason;
}