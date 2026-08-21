package com.lms_erp.student.repository;

import com.lms_erp.student.entity.Contract;
import com.lms_erp.student.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository
        extends JpaRepository<Contract, Long> {

    List<Contract>
    findByBatch_BatchIdAndStatus(
            Long batchId,
            ContractStatus status
    );

    List<Contract>
    findByStatus(
            ContractStatus status
    );
}