package com.lms_erp.student.repository;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentBatchRepository
        extends JpaRepository<StudentBatch, Long> {

    // =========================================================
    // BASIC METHODS
    // =========================================================

    long countByBatchBatchId(Long batchId);

    boolean existsByStudentApplicationPersonPersonIdAndBatchBatchId(
            Long personId,
            Long batchId
    );

    boolean existsByStudentApplicationPersonPersonId(
            Long personId
    );

    List<StudentBatch> findByBatch(Batch batch);

    List<StudentBatch> findByBatchBatchId(Long batchId);

    Optional<StudentBatch> findTopByStudentApplicationOrderByAssignedDateDesc(
            StudentApplication studentApplication
    );

    boolean existsByStudentApplicationPersonId(Long personId);

    Optional<StudentBatch> findByStudentApplicationPersonPersonId(
            Long personId
    );

    // =========================================================
    // TRAINER
    // =========================================================

    @Query("""
            SELECT sb
            FROM StudentBatch sb
            JOIN FETCH sb.studentApplication sa
            JOIN FETCH sa.person p
            JOIN FETCH sb.batch b
            JOIN FETCH b.program
            JOIN FETCH b.trainer t
            WHERE t.personId = :personId
            ORDER BY p.firstName
            """)
    List<StudentBatch> findStudentsByTrainerPersonId(
            @Param("personId") Long personId
    );

    @Query("""
            SELECT COUNT(sb)
            FROM StudentBatch sb
            WHERE sb.batch.trainer.personId = :personId
            """)
    Long countStudentsByTrainer(
            @Param("personId") Long personId
    );

    @Query("""
            SELECT sb
            FROM StudentBatch sb
            JOIN FETCH sb.studentApplication sa
            JOIN FETCH sa.person p
            JOIN FETCH sa.applicationStage aps
            JOIN FETCH sb.batch b
            JOIN FETCH b.program
            JOIN FETCH b.trainer t
            JOIN FETCH b.batchStatus bs
            WHERE t.personId = :personId
              AND UPPER(bs.batchStatusName) = 'ONGOING'
              AND UPPER(aps.applicationStageName) = 'ACTIVE'
            ORDER BY p.firstName
            """)
    List<StudentBatch> findCurrentBatchStudentsByTrainerPersonId(
            @Param("personId") Long personId
    );

    // =========================================================
    // BATCH STATISTICS
    // =========================================================

    @Query("""
            SELECT COUNT(sb)
            FROM StudentBatch sb
            JOIN sb.studentApplication sa
            JOIN sa.applicationStage aps
            WHERE sb.batch.batchId = :batchId
              AND UPPER(aps.applicationStageName) = 'COURSE_COMPLETED'
            """)
    Long countGraduatedStudents(
            @Param("batchId") Long batchId
    );

    @Query("""
            SELECT COUNT(sb)
            FROM StudentBatch sb
            JOIN sb.studentApplication sa
            JOIN sa.applicationStage aps
            WHERE sb.batch.batchId = :batchId
              AND UPPER(aps.applicationStageName) = 'DROPPED'
            """)
    Long countDroppedStudents(
            @Param("batchId") Long batchId
    );

    @Query("""
            SELECT COUNT(sb)
            FROM StudentBatch sb
            JOIN sb.studentApplication sa
            JOIN sa.applicationStage aps
            WHERE sb.batch.batchId = :batchId
              AND UPPER(aps.applicationStageName) = 'ACTIVE'
            """)
    Long countActiveStudents(
            @Param("batchId") Long batchId
    );
}