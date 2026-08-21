package com.lms_erp.lead.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadAssignment {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    // =====================================================
    // CANDIDATE
    // =====================================================

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Lead lead;

    // =====================================================
    // ASSIGNED TO EMPLOYEE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_person_id", nullable = false)
    private Employee employee;

    // =====================================================
    // ASSIGNED BY EMPLOYEE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_person_id")
    private Employee assignedBy;

    // =====================================================
    // ASSIGNMENT DETAILS
    // =====================================================

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}