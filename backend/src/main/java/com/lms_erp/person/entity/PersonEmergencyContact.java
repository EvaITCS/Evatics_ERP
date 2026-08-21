package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "person_emergency_contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonEmergencyContact {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emergency_contact_id")
    private Long emergencyContactId;

    // =====================================================
    // PERSON
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "person_id",
            nullable = false
    )
    private Person person;

    // =====================================================
    // BASIC DETAILS
    // =====================================================

    @Column(
            name = "contact_name",
            nullable = false,
            length = 100
    )
    private String contactName;

    @Column(
            name = "relationship",
            nullable = false,
            length = 50
    )
    private String relationship;

    @Column(
            name = "phone_number",
            nullable = false,
            length = 30
    )
    private String phoneNumber;

    // =====================================================
    // ADDRESS
    // =====================================================

    @Column(
            name = "address_line_1",
            nullable = false,
            length = 255
    )
    private String addressLine1;

    @Column(
            name = "address_line_2",
            length = 255
    )
    private String addressLine2;

    @Column(
            name = "city",
            nullable = false,
            length = 100
    )
    private String city;

    @Column(
            name = "state",
            nullable = false,
            length = 100
    )
    private String state;

    @Column(
            name = "country",
            nullable = false,
            length = 100
    )
    private String country;

    @Column(
            name = "zipcode",
            nullable = false,
            length = 20
    )
    private String zipcode;

    // =====================================================
    // AUDIT
    // =====================================================

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime updatedAt;
}