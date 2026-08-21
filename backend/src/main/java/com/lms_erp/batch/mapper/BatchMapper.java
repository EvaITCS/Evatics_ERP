package com.lms_erp.batch.mapper;

import com.lms_erp.batch.dto.BatchResponse;
import com.lms_erp.batch.entity.Batch;
import com.lms_erp.employee.entity.Employee;

public class BatchMapper {

    public static BatchResponse mapToResponse(Batch batch) {

        if (batch == null) {
            return null;
        }

        String calculatedTrainerName = "Not Assigned";

        Employee trainer = batch.getTrainer();

        if (trainer != null) {

            if (trainer.getPerson() != null) {

                String firstName =
                        trainer.getPerson().getFirstName();

                String lastName =
                        trainer.getPerson().getLastName();

                calculatedTrainerName =
                        ((firstName != null ? firstName : "")
                                + " "
                                + (lastName != null ? lastName : ""))
                                .trim();

                if (calculatedTrainerName.isEmpty()) {
                    calculatedTrainerName = "Unnamed Trainer";
                }

            } else {

                calculatedTrainerName = "Profile Incomplete";
            }
        }

        return BatchResponse.builder()
                .batchId(batch.getBatchId())
                .batchCode(batch.getBatchCode())
                .currentStrength(batch.getCurrentStrength())
                .maxStudents(batch.getMaxStudents())
                .status(
                        batch.getBatchStatus() != null
                                ? batch.getBatchStatus().getBatchStatusName()
                                : null
                )
                .programName(
                        batch.getProgram() != null
                                ? batch.getProgram().getProgramName()
                                : null
                )
                .trainerName(calculatedTrainerName)
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .build();
    }
}