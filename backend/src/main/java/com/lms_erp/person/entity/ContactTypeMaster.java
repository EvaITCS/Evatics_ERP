package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_type_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactTypeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_type_id")
    private Long contactTypeId;

    @Column(name = "contact_type_name", nullable = false, unique = true, length = 50)
    private String contactTypeName;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}