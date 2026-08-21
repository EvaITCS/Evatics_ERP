package com.lms_erp.batch.repository;

import com.lms_erp.batch.entity.Batch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.lms_erp.batch.dto.BatchResponse;

import java.util.Optional;

public interface BatchRepository
        extends JpaRepository<Batch, Long> {

    @Query("""
SELECT new com.lms_erp.batch.dto.BatchResponse(
    b.batchId,
    b.batchCode,
    b.batchName,
    concat(pe.firstName,' ',pe.lastName),
    p.programName,
    bs.batchStatusName,
    b.startDate,
    b.endDate,
    b.currentStrength,
    b.maxStudents
)
FROM Batch b
LEFT JOIN b.program p
LEFT JOIN b.trainer e
LEFT JOIN e.person pe
LEFT JOIN b.batchStatus bs
""")
    List<BatchResponse> getBatchList();


    @Query("""
SELECT b
FROM Batch b
LEFT JOIN FETCH b.program
LEFT JOIN FETCH b.batchStatus
LEFT JOIN FETCH b.trainer t
LEFT JOIN FETCH t.person
WHERE b.batchId = :batchId
""")
    Optional<Batch> findBatchDetails(
            @Param("batchId")
            Long batchId
    );

    // =========================
    // FIND BY BATCH CODE
    // =========================

    Optional<Batch> findByBatchCode(
            String batchCode
    );

    // =========================
    // TOTAL BATCHES
    // =========================

    @Query("""
            SELECT COUNT(b)
            FROM Batch b
            """)
    Integer countTotalBatches();

    // =========================
    // ONGOING BATCHES
    // =========================

    @Query("""
SELECT COUNT(b)
FROM Batch b
WHERE CURRENT_DATE >= b.startDate
AND CURRENT_DATE <= b.endDate
""")
    Integer countOngoingBatches();
    // =========================
    // COMPLETED BATCHES
    // =========================

    @Query("""
SELECT COUNT(b)
FROM Batch b
WHERE CURRENT_DATE > b.endDate
""")
    Integer countCompletedBatches();

    // =========================
    // UPCOMING BATCHES
    // =========================

    @Query("""
SELECT COUNT(b)
FROM Batch b
WHERE CURRENT_DATE < b.startDate
""")
    Integer countUpcomingBatches();

    Optional<Batch> findById(Long batchId);

    boolean existsByTrainerPersonId(Long personId);

    boolean existsByTrainerPersonIdAndBatchIdNot(
            Long personId,
            Long batchId
    );

}