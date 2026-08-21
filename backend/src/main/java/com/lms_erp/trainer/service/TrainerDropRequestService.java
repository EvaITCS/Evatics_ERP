package com.lms_erp.trainer.service;

import com.lms_erp.trainer.dto.*;

import java.util.List;

public interface TrainerDropRequestService {

    StudentDropRequestResponse createDropRequest(
            Long studentBatchId,
            Long trainerPersonId,
            DropStudentRequest request
    );

    StudentDropRequestResponse assignCounselor(
            Long dropRequestId,
            AssignCounselorRequest request,
            Long adminPersonId
    );

    StudentDropRequestResponse submitRecommendation(
            Long dropRequestId,
            Long counselorPersonId,
            CounselorRecommendationRequest request
    );

    StudentDropRequestResponse adminDecision(
            Long dropRequestId,
            Long adminPersonId,
            AdminDecisionRequest request
    );

    List<StudentDropRequestResponse> getTrainerRequests(
            Long trainerPersonId
    );

    List<StudentDropRequestResponse> getCounselorRequests(
            Long counselorPersonId
    );

    List<StudentDropRequestResponse> getPendingRequests();

    StudentDropRequestResponse getRequest(
            Long dropRequestId
    );
}