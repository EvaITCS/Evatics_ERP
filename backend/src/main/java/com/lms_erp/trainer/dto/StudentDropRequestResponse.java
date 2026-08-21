package com.lms_erp.trainer.dto;

import com.lms_erp.trainer.enums.RecommendationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDropRequestResponse {

    private Long dropRequestId;

    // Student Details
    private Long studentBatchId;
    private Long studentPersonId;
    private String studentName;

    // Batch Details
    private Long batchId;
    private String batchCode;

    // Requested By
    private Long requestedByPersonId;
    private String requestedByName;

    // Assigned Counselor
    private Long assignedToPersonId;
    private String assignedToName;

    private String batchName;
    // Reviewed By
    private Long reviewedByPersonId;
    private String reviewedByName;

    // Drop Status
    private Long dropStatusId;
    private String dropStatus;

    // Request Details
    private String dropReason;
    private RecommendationType recommendation;
    private String reviewRemarks;

    // Timeline
    private LocalDateTime requestedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime reviewedAt;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}