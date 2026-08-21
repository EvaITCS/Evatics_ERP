package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "employee_activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeActivityLog {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_log_id")
    private Long activityLogId;

    // =====================================================
    // EMPLOYEE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Employee employee;

    // =====================================================
    // CREATED BY
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_person_id")
    private Employee createdBy;

    // =====================================================
    // ACTIVITY DETAILS
    // =====================================================

    @Column(name = "activity_type", length = 100)
    private String activityType;

    @Column(name = "activity_description", columnDefinition = "TEXT")
    private String activityDescription;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}