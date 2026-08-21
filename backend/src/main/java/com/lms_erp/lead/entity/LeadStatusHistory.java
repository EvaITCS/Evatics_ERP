package com.lms_erp.lead.entity;

import com.lms_erp.person.entity.Person;
import com.lms_erp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    // =====================================
    // LEAD
    // =====================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Lead lead;

    // =====================================
    // OLD STATUS
    // =====================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "old_status_id")
    private LeadStatusMaster oldStatus;

    // =====================================
    // NEW STATUS
    // =====================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_status_id", nullable = false)
    private LeadStatusMaster newStatus;

    // =====================================
    // CHANGED BY
    // =====================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_person_id", nullable = false)
    private Person changedByPerson;

    // =====================================
    // REMARKS
    // =====================================

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // =====================================
    // CHANGED AT
    // =====================================

    @Column(name = "changed_at", insertable = false, updatable = false)
    private LocalDateTime changedAt;
}