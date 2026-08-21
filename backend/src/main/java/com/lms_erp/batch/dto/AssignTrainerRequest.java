// src/main/java/com/lms_erp/batch/dto/AssignTrainerRequest.java

package com.lms_erp.batch.dto;

import lombok.Data;

@Data
public class AssignTrainerRequest {

    private Long personId;

    private Long batchId;
}