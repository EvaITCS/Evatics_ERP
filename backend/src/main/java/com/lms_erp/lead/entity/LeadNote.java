package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadNote {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Long noteId;

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
    // NOTE
    // =====================================================

    @Column(name = "note_text", nullable = false, columnDefinition = "TEXT")
    private String noteText;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}