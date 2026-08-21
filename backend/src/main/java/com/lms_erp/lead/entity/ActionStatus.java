package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "action_status_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_status_id")
    private Long actionStatusId;

    @Column(name = "status_name", nullable = false, unique = true, length = 100)
    private String statusName;
}