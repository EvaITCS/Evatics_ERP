package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.person.entity.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    // =====================================================
    // PRIMARY KEY (Shared with Person)
    // =====================================================

    @Id
    @Column(name = "person_id")
    private Long personId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    // =====================================================
    // LEAD SOURCE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private LeadSource leadSource;
    @Column(name = "custom_lead_source")
    private String customLeadSource;
    // =====================================================
    // LEAD STATUS
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_status_id")
    private LeadStatusMaster leadStatus;

    // =====================================================
    // LEAD PRIORITY
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "lead_priority", length = 30)
    private LeadPriority leadPriority;

    // =====================================================
    // FOLLOW-UP
    // =====================================================

    @Column(name = "next_followup_date")
    private LocalDateTime nextFollowupDate;

    // =====================================================
    // EXPERIENCE
    // =====================================================

    @Builder.Default
    @Column(name = "computer_experience", nullable = false)
    private Boolean computerExperience = false;

    // =====================================================
    // ARCHIVE
    // =====================================================

    @Builder.Default
    @Column(name = "is_archived", nullable = false)
    private Boolean isArchived = false;

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_job_id")
    private LeadImportJob importJob;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_person_id", nullable = false)
    private Employee createdBy;
    // =====================================================
    // AUDIT
    // =====================================================
    @Column(name = "re_engagement_date")
    private LocalDateTime reEngagementDate;
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}