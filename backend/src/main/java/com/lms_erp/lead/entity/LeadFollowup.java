package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.FollowupType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_followups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadFollowup {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "followup_id")
    private Long followupId;

    // =====================================================
    // LEAD
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Lead lead;

    // =====================================================
    // EMPLOYEE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_person_id", nullable = false)
    private Employee employee;

    // =====================================================
    // FOLLOW-UP TYPE
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "followup_type", nullable = false, length = 50)
    private FollowupType followupType;

    // =====================================================
    // FOLLOW-UP STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "followup_status", nullable = false, length = 20)
    private FollowupStatus followupStatus = FollowupStatus.PENDING;

    // =====================================================
    // REMARKS
    // =====================================================

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // =====================================================
    // SCHEDULE
    // =====================================================

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "next_followup_at")
    private LocalDateTime nextFollowupAt;

    // =====================================================
    // RETRY
    // =====================================================

    @Builder.Default
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}