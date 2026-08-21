package com.lms_erp.student.dto;

import com.lms_erp.student.enums.StudentDashboardType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDashboardResponse {

    // Student
    private Long personId;

    private String name;

    private String email;

    // Program
    private String program;

    // Application
    private Long applicationStageId;

    private String currentStage;

    private String submittedOn;

    // Batch
    private String batchStartDate;

    private LocalDate batchStartDateIso;

    // Dashboard
    private StudentDashboardType dashboardType;
}