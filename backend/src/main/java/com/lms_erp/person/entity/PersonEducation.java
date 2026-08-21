package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "person_education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_education_id")
    private Long personEducationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "qualification", nullable = false, length = 100)
    private String qualification;

    @Column(name = "institute_name", length = 150)
    private String instituteName;

    @Column(name = "field_of_study", length = 100)
    private String fieldOfStudy;

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}