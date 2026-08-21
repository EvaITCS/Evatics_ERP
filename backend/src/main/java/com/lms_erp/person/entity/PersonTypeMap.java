package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "person_type_map",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_person_type",
                        columnNames = {"person_id", "person_type_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonTypeMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_type_map_id")
    private Long personTypeMapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_type_id", nullable = false)
    private PersonType personType;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}