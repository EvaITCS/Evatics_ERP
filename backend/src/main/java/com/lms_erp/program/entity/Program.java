package com.lms_erp.program.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    @Column(name = "program_name", nullable = false, length = 150)
    private String programName;

    @Column(name = "program_code", unique = true, length = 50)
    private String programCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_value", nullable = false)
    private Integer durationValue;

    @Column(name = "duration_type", nullable = false, length = 20)
    private String durationType;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}