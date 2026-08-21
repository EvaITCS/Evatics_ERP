package com.lms_erp.employee.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "work_modes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkMode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mode_id")
    private Long modeId;

    @Column(name = "mode_name", nullable = false, unique = true, length = 50)
    private String modeName;
}