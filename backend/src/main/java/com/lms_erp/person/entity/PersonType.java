package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "person_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_type_id")
    private Long personTypeId;

    @Column(name = "type_name", nullable = false, unique = true, length = 50)
    private String typeName;
}