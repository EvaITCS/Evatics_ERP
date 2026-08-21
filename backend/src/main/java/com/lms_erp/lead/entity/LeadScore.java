package com.lms_erp.lead.entity;

import com.lms_erp.lead.enums.LeadPriority;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadScore {

    // =====================================================
    // PRIMARY KEY (Shared with Candidate)
    // =====================================================

    @Id
    @Column(name = "person_id")
    private Long personId;

    // =====================================================
    // LEAD
    // =====================================================

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "person_id")
    private Lead lead;

    // =====================================================
    // SCORING PARAMETERS
    // =====================================================

    @Builder.Default
    @Column(name = "call_score", nullable = false)
    private Integer callScore = 0;

    @Builder.Default
    @Column(name = "email_score", nullable = false)
    private Integer emailScore = 0;

    @Builder.Default
    @Column(name = "document_score", nullable = false)
    private Integer documentScore = 0;

    @Builder.Default
    @Column(name = "followup_score", nullable = false)
    private Integer followupScore = 0;

    @Builder.Default
    @Column(name = "engagement_score", nullable = false)
    private Integer engagementScore = 0;

    @Builder.Default
    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    // =====================================================
    // LEAD PRIORITY
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "lead_priority", nullable = false, length = 20)
    private LeadPriority leadPriority = LeadPriority.WARM;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}