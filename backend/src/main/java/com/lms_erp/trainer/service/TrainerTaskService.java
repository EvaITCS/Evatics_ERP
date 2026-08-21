package com.lms_erp.trainer.service;

import com.lms_erp.trainer.dto.TrainerTaskCreateRequest;
import com.lms_erp.trainer.dto.TrainerTaskResponse;
import com.lms_erp.trainer.enums.TaskStatus;

import java.util.List;

public interface TrainerTaskService {
    TrainerTaskResponse createTask(TrainerTaskCreateRequest request);
    List<TrainerTaskResponse> getTasksByTrainer();
    TrainerTaskResponse updateTaskStatus(Long taskId, TaskStatus status);
}