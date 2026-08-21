package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_status_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeStatusMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_status_id")
    private Long employeeStatusId;

    @Column(
            name = "status_name",
            nullable = false,
            unique = true,
            length = 50
    )
    private String statusName;
}