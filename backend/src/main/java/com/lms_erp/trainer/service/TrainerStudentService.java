package com.lms_erp.trainer.service;

import com.lms_erp.trainer.dto.TrainerStudentResponse;

import java.util.List;

public interface TrainerStudentService {

    List<TrainerStudentResponse> getMyStudents(
            Long userId
    );
    List<TrainerStudentResponse> getCurrentBatchStudents(
            Long userId
    );
}