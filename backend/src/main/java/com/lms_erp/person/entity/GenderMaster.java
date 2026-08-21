package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "gender_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenderMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gender_id")
    private Long genderId;

    @Column(name = "gender_name", nullable = false, unique = true)
    private String genderName;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}