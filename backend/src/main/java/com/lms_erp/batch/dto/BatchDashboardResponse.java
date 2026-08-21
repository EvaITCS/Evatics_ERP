package com.lms_erp.batch.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BatchDashboardResponse {

    private Integer totalBatches;

    private Integer ongoingBatches;

    private Integer upcomingBatches;

    private Integer completedBatches;
}