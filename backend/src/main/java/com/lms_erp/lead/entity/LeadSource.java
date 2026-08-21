package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_sources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "source_id")
    private Long sourceId;

    @Column(name = "source_name", nullable = false, unique = true)
    private String sourceName;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}