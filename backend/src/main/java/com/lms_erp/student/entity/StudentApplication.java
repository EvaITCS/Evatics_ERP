package com.lms_erp.student.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.person.entity.Person;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentApplication {

    /**
     * Primary Key = person_id
     */
    @Id
    @Column(name = "person_id")
    private Long personId;

    /**
     * Shared Primary Key with Person
     */
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "person_id")
    private Person person;

    /**
     * Counselor assigned to this application
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counselor_person_id")
    private Employee counselor;


    @Column(name = "current_step", nullable = false)
    private Integer currentStep = 0;

    /**
     * Current Application Stage
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_stage_id", nullable = false)
    private ApplicationStageMaster applicationStage;


    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "recheck_reason", columnDefinition = "TEXT")
    private String recheckReason;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}