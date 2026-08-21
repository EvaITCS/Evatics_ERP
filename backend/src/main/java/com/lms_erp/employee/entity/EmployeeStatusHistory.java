package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "employee_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeStatusHistory {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    // =====================================================
    // EMPLOYEE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Employee employee;

    // =====================================================
    // STATUS
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "old_status_id")
    private EmployeeStatusMaster oldStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "new_status_id", nullable = false)
    private EmployeeStatusMaster newStatus;

    // =====================================================
    // CHANGED BY
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_person_id")
    private Employee changedBy;

    // =====================================================
    // DETAILS
    // =====================================================

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "changed_at", insertable = false, updatable = false)
    private LocalDateTime changedAt;
}