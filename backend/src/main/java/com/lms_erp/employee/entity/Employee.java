package com.lms_erp.employee.entity;

import com.lms_erp.person.entity.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    // =====================================================
    // SHARED PRIMARY KEY (PERSON)
    // =====================================================

    @Id
    @Column(name = "person_id")
    private Long personId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    // =====================================================
    // BASIC DETAILS
    // =====================================================

    @Column(name = "employee_code", nullable = false, unique = true, length = 30)
    private String employeeCode;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;

    @Builder.Default
    @Column(name = "is_married", nullable = false)
    private Boolean isMarried = false;

    // =====================================================
    // ORGANIZATION DETAILS
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "designation_id", nullable = false)
    private Designation designation;

    // Permanent / Contract / Intern / Part-Time
    @Column(name = "employment_type", nullable = false, length = 30)
    private String employmentType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_status_id", nullable = false)
    private EmployeeStatusMaster employeeStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mode_id")
    private WorkMode workMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}