package com.lms_erp.batch.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "batch_status_master")
@Getter
@Setter
public class BatchStatusMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "batch_status_id")
    private Long batchStatusId;

    @Column(name = "batch_status_name", nullable = false, unique = true, length = 50)
    private String batchStatusName;
}