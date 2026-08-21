package com.lms_erp.trainer.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerResponse {

    private Long trainerPersonId;

    private String trainerName;

    private String email;


    private String status;
}