package com.lms_erp.batch.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.program.entity.Program;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "batch_id")
    private Long batchId;

    @Column(name = "batch_code", nullable = false, unique = true, length = 50)
    private String batchCode;

    @Column(name = "batch_name", nullable = false, length = 100)
    private String batchName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_person_id")
    private Employee trainer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_status_id", nullable = false)
    private BatchStatusMaster batchStatus;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "min_students")
    private Integer minStudents;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Column(name = "current_strength")
    @Builder.Default
    private Integer currentStrength = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_person_id")
    private Employee createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}