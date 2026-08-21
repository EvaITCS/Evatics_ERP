package com.lms_erp.student.repository;

import com.lms_erp.student.entity.CandidateContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateContractRepository
        extends JpaRepository<CandidateContract, Long> {

    Optional<CandidateContract>
    findByContractContractIdAndCandidatePersonId(
            Long contractId,
            Long personId
    );

    Optional<CandidateContract>
    findTopByCandidatePersonIdOrderByCreatedAtDesc(
            Long personId
    );
}