package com.lms_erp.trainer.repository;

import com.lms_erp.trainer.entity.TrainerTask;
import com.lms_erp.trainer.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerTaskRepository extends JpaRepository<TrainerTask, Long> {

    // ==========================================================
    // GET ALL TASKS OF A TRAINER
    // ==========================================================

    List<TrainerTask> findByTrainerPersonId(Long personId);

    // ==========================================================
    // GET TASKS BY TRAINER & STATUS
    // ==========================================================

    List<TrainerTask> findByTrainerPersonIdAndStatus(
            Long personId,
            TaskStatus status
    );

    // ==========================================================
    // COUNT PENDING TASKS
    // ==========================================================

    @Query("""
            SELECT COUNT(t)
            FROM TrainerTask t
            WHERE t.trainer.personId = :personId
            AND t.status = :status
            """)
    Integer countPendingTasksByTrainerId(
            @Param("personId") Long personId,
            @Param("status") TaskStatus status
    );

    // ==========================================================
    // GET ALL PENDING TASKS
    // ==========================================================

    @Query("""
            SELECT t
            FROM TrainerTask t
            WHERE t.trainer.personId = :personId
            AND t.status = com.lms_erp.trainer.enums.TaskStatus.PENDING
            ORDER BY t.dueDate ASC
            """)
    List<TrainerTask> findPendingTasks(
            @Param("personId") Long personId
    );

    // ==========================================================
    // GET ALL COMPLETED TASKS
    // ==========================================================

    @Query("""
        SELECT t
        FROM TrainerTask t
        WHERE t.trainer.personId = :personId
        AND t.status = com.lms_erp.trainer.enums.TaskStatus.COMPLETED
        ORDER BY t.createdAt DESC
        """)
    List<TrainerTask> findCompletedTasks(
            @Param("personId") Long personId
    );

}