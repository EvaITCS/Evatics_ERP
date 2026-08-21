package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_import_staging")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadImportStaging {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staging_id")
    private Long stagingId;

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "import_job_id", nullable = false)
    private LeadImportJob importJob;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_person_id")
    private Employee assignedEmployee;

    @Builder.Default
    @Column(name = "auto_assigned", nullable = false)
    private Boolean autoAssigned = false;

    // =====================================================
    // IMPORTED LEAD DATA
    // =====================================================

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "visa_type", length = 100)
    private String visaType;

    @Column(name = "visa_status", length = 100)
    private String visaStatus;

    @Column(name = "reject_reason", length = 255)
    private String rejectReason;

    @Column(name = "extra_data", columnDefinition = "JSON")
    private String extraData;

    // =====================================================
    // VALIDATION
    // =====================================================

    @Builder.Default
    @Column(name = "is_duplicate", nullable = false)
    private Boolean isDuplicate = false;

    @Builder.Default
    @Column(name = "is_invalid", nullable = false)
    private Boolean isInvalid = false;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}