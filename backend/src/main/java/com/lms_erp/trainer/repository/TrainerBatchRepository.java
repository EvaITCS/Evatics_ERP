package com.lms_erp.trainer.repository;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.trainer.dto.TrainerBatchDetailsResponse;
import com.lms_erp.trainer.dto.TrainerBatchPageResponse;
import com.lms_erp.trainer.dto.TrainerBatchResponse;
import com.lms_erp.trainer.dto.TrainerBatchSummaryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerBatchRepository extends JpaRepository<Batch, Long> {

    // ==========================================================
    // TRAINER BATCH LIST
    // ==========================================================

    @Query("""
        SELECT new com.lms_erp.trainer.dto.TrainerBatchResponse(
            b.batchId,
            b.batchCode,
            b.batchName,
            p.programName,
            b.currentStrength,
            b.startDate,
            bs.batchStatusName
        )
        FROM Batch b
        LEFT JOIN b.program p
        LEFT JOIN b.batchStatus bs
        WHERE b.trainer.personId = :trainerPersonId
        ORDER BY b.startDate DESC
        """)
    List<TrainerBatchResponse> getTrainerBatches(
            @Param("trainerPersonId") Long trainerPersonId
    );

    // ==========================================================
    // TOTAL BATCH COUNT
    // ==========================================================

    @Query("""
        SELECT COUNT(b)
        FROM Batch b
        WHERE b.trainer.personId = :trainerPersonId
        """)
    Long countBatches(
            @Param("trainerPersonId") Long trainerPersonId
    );

    // ==========================================================
    // TOTAL STUDENTS
    // ==========================================================

    @Query("""
        SELECT COUNT(sb)
        FROM StudentBatch sb
        WHERE sb.batch.trainer.personId = :trainerPersonId
        """)
    Long countStudentsByTrainer(
            @Param("trainerPersonId") Long trainerPersonId
    );

    // ==========================================================
    // BATCH DETAILS
    // ==========================================================

    @Query("""
        SELECT new com.lms_erp.trainer.dto.TrainerBatchDetailsResponse(

            b.batchId,

            b.batchCode,

            b.batchName,

            bs.batchStatusName,

            SUM(
                CASE
                    WHEN ap.applicationStageName='ACTIVE'
                    THEN 1
                    ELSE 0
                END
            ),

            SUM(
                CASE
                    WHEN ap.applicationStageName IN
                    ('COURSE_COMPLETED','PLACED')
                    THEN 1
                    ELSE 0
                END
            ),

            b.startDate,

            b.endDate

        )

        FROM Batch b

        LEFT JOIN b.batchStatus bs

        LEFT JOIN StudentBatch sb
        ON sb.batch=b

        LEFT JOIN sb.applicationStage ap

        WHERE b.trainer.personId=:trainerPersonId

        GROUP BY

        b.batchId,
        b.batchCode,
        b.batchName,
        bs.batchStatusName,
        b.startDate,
        b.endDate

        ORDER BY b.startDate ASC
        """)
    List<TrainerBatchDetailsResponse> getAllTrainerBatchDetails(
            @Param("trainerPersonId") Long trainerPersonId
    );

    // ==========================================================
    // BATCH SUMMARY
    // ==========================================================

    @Query("""
        SELECT new com.lms_erp.trainer.dto.TrainerBatchSummaryResponse(

            b.batchId,

            b.batchCode,

            b.batchName,

            SUM(
                CASE
                    WHEN ap.applicationStageName='ACTIVE'
                    THEN 1
                    ELSE 0
                END
            ),

            SUM(
                CASE
                    WHEN ap.applicationStageName IN
                    ('COURSE_COMPLETED','PLACED')
                    THEN 1
                    ELSE 0
                END
            ),

            SUM(
                CASE
                    WHEN ap.applicationStageName='DROPPED'
                    THEN 1
                    ELSE 0
                END
            )

        )

        FROM Batch b

        LEFT JOIN StudentBatch sb
        ON sb.batch = b

        LEFT JOIN sb.applicationStage ap

        WHERE b.trainer.personId = :trainerPersonId

        GROUP BY
            b.batchId,
            b.batchCode,
            b.batchName

        ORDER BY b.startDate ASC
        """)
    List<TrainerBatchSummaryResponse> getBatchSummary(
            @Param("trainerPersonId") Long trainerPersonId
    );

    // ==========================================================
    // TRAINER BATCH PAGE
    // ==========================================================
    @Query("""
    SELECT new com.lms_erp.trainer.dto.TrainerBatchPageResponse(

        b.batchId,

        b.batchCode,

        b.batchName,

        p.programName,

        bs.batchStatusName,

        b.startDate,

        b.endDate,

        COUNT(sb.studentBatchId),

        SUM(
            CASE
                WHEN ap.applicationStageName = 'COURSE_COMPLETED'
                THEN 1
                ELSE 0
            END
        ),

        SUM(
            CASE
                WHEN ap.applicationStageName = 'DROPPED'
                     OR sb.droppedDate IS NOT NULL
                THEN 1
                ELSE 0
            END
        )

    )

    FROM Batch b

    LEFT JOIN b.program p

    LEFT JOIN b.batchStatus bs

    LEFT JOIN StudentBatch sb
        ON sb.batch = b

    LEFT JOIN sb.applicationStage ap

    WHERE b.trainer.personId = :trainerPersonId

    GROUP BY
        b.batchId,
        b.batchCode,
        b.batchName,
        p.programName,
        bs.batchStatusName,
        b.startDate,
        b.endDate

    ORDER BY b.batchName
    """)
    List<TrainerBatchPageResponse> findTrainerBatchPage(
            @Param("trainerPersonId") Long trainerPersonId
    );




}