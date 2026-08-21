package com.lms_erp.student.entity;

import com.lms_erp.batch.entity.Batch;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_batches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_batch",
                        columnNames = {"person_id", "batch_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_batch_id")
    private Long studentBatchId;

    /**
     * Student Application
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private StudentApplication studentApplication;

    /**
     * Assigned Batch
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    /**
     * Current Application Stage
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_stage_id", nullable = false)
    private ApplicationStageMaster applicationStage;

    /**
     * Audit
     */
    @Column(name = "assigned_date", insertable = false, updatable = false)
    private LocalDateTime assignedDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(name = "dropped_date")
    private LocalDate droppedDate;

    @Column(name = "drop_reason", length = 500)
    private String dropReason;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}