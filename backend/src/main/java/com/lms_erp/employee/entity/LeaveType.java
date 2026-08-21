package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_type_id")
    private Long leaveTypeId;

    @Column(name = "leave_type_name", nullable = false, unique = true, length = 100)
    private String leaveTypeName;

    @Column(name = "max_days_allowed")
    private Integer maxDaysAllowed;

    @Builder.Default
    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid = true;
}