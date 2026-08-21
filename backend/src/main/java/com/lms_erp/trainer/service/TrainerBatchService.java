package com.lms_erp.trainer.service;

import com.lms_erp.trainer.dto.*;

import java.util.List;

public interface TrainerBatchService {

    List<TrainerBatchResponse>
    getTrainerBatches(Long trainerId);

    List<TrainerBatchResponse>
    getTrainerBatchesByUserId(Long userId);

    List<TrainerBatchDetailsResponse>
    getMyBatchDetails(Long userId);

    List<TrainerBatchSummaryResponse>
    getBatchSummary(Long userId);

    List<TrainerBatchPageResponse>
    getTrainerBatchPage(Long userId);

    List<TrainerBatchStudentResponse>
    getBatchStudents(
            Long batchId,
            String type
    );
    void dropStudent(
            Long studentBatchId,
            String reason
    );
}