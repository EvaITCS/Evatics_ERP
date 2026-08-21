package com.lms_erp.person.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "nationality_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NationalityMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nationality_id")
    private Long nationalityId;

    @Column(name = "nationality_name", nullable = false, length = 100)
    private String nationalityName;

    // Expose countryId for frontend
    @Column(name = "country_id", insertable = false, updatable = false)
    private Long countryId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private CountryMaster country;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}