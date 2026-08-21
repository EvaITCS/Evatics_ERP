package com.lms_erp.batch.service;

import com.lms_erp.batch.dto.*;
import com.lms_erp.program.entity.Program;
import com.lms_erp.trainer.dto.TrainerDropdownResponse;

import java.util.List;
import java.util.Map;

public interface BatchService {

    BatchResponse createBatch(BatchCreateRequest request);

    String generateBatchCode(Long programId);

    List<Program> getAllPrograms();

    List<BatchResponse> getAllBatches();

    void deleteBatch(
            Long batchId
    );

    void assignTrainer(AssignTrainerRequest request);

    BatchDetailsResponse getBatchDetails(Long batchId);

    BatchResponse updateBatch(Long batchId, UpdateBatchRequest request);

    Map<String, Integer> getBatchDashboard();

    BatchDashboardResponse getDashboard();

    List<TrainerDropdownResponse>
    getAllTrainers();

    List<TrainerDropdownResponse> getAvailableTrainers();

    List<TrainerDropdownResponse> getAvailableTrainersForEdit(Long batchId);
}