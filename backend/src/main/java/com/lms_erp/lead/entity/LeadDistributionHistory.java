package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_distribution_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadDistributionHistory {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "distribution_id")
    private Long distributionId;

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_job_id", nullable = false)
    private LeadImportJob importJob;

    // =====================================================
    // ASSIGNED TO
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_person_id", nullable = false)
    private Employee assignedTo;

    // =====================================================
    // ASSIGNED BY
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_person_id", nullable = false)
    private Employee assignedBy;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private LocalDateTime assignedAt;
}