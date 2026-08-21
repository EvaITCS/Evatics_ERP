package com.lms_erp.lead.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.enums.FollowupType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "communication_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadActivity {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    // =====================================================
    // CANDIDATE
    // =====================================================

    @JsonIgnore
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
    // COMMUNICATION
    // =====================================================

//    @Enumerated(EnumType.STRING)
//    @Column(name = "communication_type", nullable = false, length = 30)
//    private FollowupType communicationType;

    @Column(name = "communication_type", nullable = false, length = 50)
    private String communicationType;

    @Column(name = "communication_status", length = 30)
    private String communicationStatus;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "communication_time", insertable = false, updatable = false)
    private LocalDateTime communicationTime;
}