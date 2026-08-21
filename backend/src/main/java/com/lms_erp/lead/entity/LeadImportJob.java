package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_import_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadImportJob {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "import_job_id")
    private Long importJobId;

    // =====================================================
    // IMPORT FILE DETAILS
    // =====================================================

    @Column(name = "original_file_name", nullable = false, length = 255)
    private String originalFileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imported_by_person_id", nullable = false)
    private Employee importedBy;

    @Column(name = "assignment_type", length = 100)
    private String assignmentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_person_id")
    private Employee assignedEmployee;

    // =====================================================
    // IMPORT SUMMARY
    // =====================================================

    @Column(name = "upload_date", insertable = false, updatable = false)
    private LocalDateTime uploadDate;

    @Builder.Default
    @Column(name = "total_records", nullable = false)
    private Integer totalRecords = 0;

    @Builder.Default
    @Column(name = "duplicate_records", nullable = false)
    private Integer duplicateRecords = 0;

    @Builder.Default
    @Column(name = "invalid_records", nullable = false)
    private Integer invalidRecords = 0;

    @Builder.Default
    @Column(name = "final_records", nullable = false)
    private Integer finalRecords = 0;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}