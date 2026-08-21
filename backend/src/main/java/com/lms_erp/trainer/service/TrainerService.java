package com.lms_erp.trainer.service;

import com.lms_erp.trainer.dto.*;

import java.util.List;

public interface TrainerService {

    List<TrainerResponse> getAllTrainers();



    TrainerDashboardResponse getDashboard();
}