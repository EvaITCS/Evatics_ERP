package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_status_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveStatusMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_status_id")
    private Long leaveStatusId;

    @Column(name = "status_name", nullable = false, unique = true, length = 50)
    private String statusName;
}