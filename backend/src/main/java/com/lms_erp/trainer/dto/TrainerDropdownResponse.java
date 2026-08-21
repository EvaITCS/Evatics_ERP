package com.lms_erp.trainer.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDropdownResponse {

    private Long trainerPersonId;

    private String trainerName;

    private String trainerEmail;

    private Integer experienceYears;

    public TrainerDropdownResponse(Long trainerPersonId, String trainerName) {
        this.trainerPersonId = trainerPersonId;
        this.trainerName = trainerName;
    }
}