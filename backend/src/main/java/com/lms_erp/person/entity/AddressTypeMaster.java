package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "address_type_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressTypeMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_type_id")
    private Long addressTypeId;

    @Column(name = "address_type_name", nullable = false, unique = true, length = 50)
    private String addressTypeName;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}