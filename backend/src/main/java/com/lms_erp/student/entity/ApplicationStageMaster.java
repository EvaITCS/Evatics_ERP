package com.lms_erp.student.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "application_stage_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStageMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_stage_id")
    private Long applicationStageId;

    @Column(name = "application_stage_name", nullable = false, unique = true, length = 100)
    private String applicationStageName;
}