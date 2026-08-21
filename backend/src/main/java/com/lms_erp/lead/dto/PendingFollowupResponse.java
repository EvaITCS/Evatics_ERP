package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingFollowupResponse {

    private Long reminderId;

    private String reminderType;

    private LocalDateTime reminderTime;

    private Boolean completed;
}
