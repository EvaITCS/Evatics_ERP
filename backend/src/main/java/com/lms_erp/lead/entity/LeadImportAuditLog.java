package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_import_audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadImportAuditLog {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "audit_id")
    private Long auditId;

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_job_id", nullable = false)
    private LeadImportJob importJob;

    // =====================================================
    // ACTION
    // =====================================================

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    // =====================================================
    // ACTION BY
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "action_by_person_id", nullable = false)
    private Employee actionBy;

    // =====================================================
    // DESCRIPTION
    // =====================================================

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "action_time", insertable = false, updatable = false)
    private LocalDateTime actionTime;
}