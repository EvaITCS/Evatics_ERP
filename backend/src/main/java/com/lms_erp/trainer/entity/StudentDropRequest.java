package com.lms_erp.trainer.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.student.entity.StudentBatch;

import com.lms_erp.trainer.enums.RecommendationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_drop_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDropRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "drop_request_id")
    private Long dropRequestId;

    // =====================================================
    // Student Batch
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_batch_id", nullable = false)
    private StudentBatch studentBatch;

    // =====================================================
    // Requested By (Employee)
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requested_by_person_id", nullable = false)
    private Employee requestedBy;

    // =====================================================
    // Assigned To (Employee)
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_person_id")
    private Employee assignedTo;

    // =====================================================
    // Reviewed By (Employee)
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_person_id")
    private Employee reviewedBy;

    // =====================================================
    // Drop Status
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drop_status_id", nullable = false)
    private StudentDropStatus dropStatus;

    // =====================================================
    // Request Details
    // =====================================================

    @Column(name = "drop_reason", nullable = false, columnDefinition = "TEXT")
    private String dropReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation", length = 100)
    private RecommendationType recommendation;

    @Column(name = "review_remarks", columnDefinition = "TEXT")
    private String reviewRemarks;

    // =====================================================
    // Timestamps
    // =====================================================

    @Column(name = "requested_at", insertable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}