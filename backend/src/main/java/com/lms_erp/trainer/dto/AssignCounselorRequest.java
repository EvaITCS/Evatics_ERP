package com.lms_erp.trainer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignCounselorRequest {

    @NotNull(message = "Counselor Person ID is required")
    private Long counselorPersonId;
}