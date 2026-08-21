package com.lms_erp.student.entity;

import com.lms_erp.student.enums.CandidateContractStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_contracts",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_candidate_contract",
                columnNames = {"contract_id", "candidate_person_id"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_contract_id")
    private Long candidateContractId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_person_id", nullable = false)
    private StudentApplication candidate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private CandidateContractStatus status = CandidateContractStatus.PENDING;

    @Column(name = "signature_type", length = 30)
    private String signatureType;

    @Column(name = "signature_data", length = 500)
    private String signatureData;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}