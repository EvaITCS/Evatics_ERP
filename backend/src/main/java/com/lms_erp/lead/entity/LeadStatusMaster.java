package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lead_status_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadStatusMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lead_status_id")
    private Long leadStatusId;

    @Column(name = "status_name", nullable = false, unique = true)
    private String statusName;
}