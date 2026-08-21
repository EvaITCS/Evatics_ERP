package com.lms_erp.batch.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BatchDetailsResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private Long programId;

    private String programName;

    private Long personId;

    private String trainerName;

    private String trainerEmail;

    private Long batchStatusId;

    private String batchStatusName;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer durationInDays;

    private Integer minStudents;

    private Integer maxStudents;

    private Integer currentStrength;

    private Integer remainingSeats;

    private LocalDateTime createdAt;

    private List<BatchStudentResponse> students;
}