package com.lms_erp.person.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "person_visa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonVisa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_visa_id")
    private Long personVisaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Column(name = "visa_type", nullable = false, length = 100)
    private String visaType;

    @Column(name = "ead_type")
    private String eadType;

//    @Column(name = "visa_number", nullable = false, length = 100)
//    private String visaNumber;

    @Column(name = "visa_expiry_date")
    private LocalDate visaExpiryDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}