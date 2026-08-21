package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_import_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadImportMapping {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mapping_id")
    private Long mappingId;

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_job_id", nullable = false)
    private LeadImportJob importJob;

    // =====================================================
    // LEAD
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Lead lead;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}