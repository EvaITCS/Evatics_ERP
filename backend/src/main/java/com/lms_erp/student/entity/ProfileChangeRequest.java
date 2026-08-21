package com.lms_erp.student.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "profile_change_requests",
        indexes = {

                @Index(
                        name = "idx_pcr_candidate_status",
                        columnList = "candidate_person_id,status"
                ),

                @Index(
                        name = "idx_pcr_status",
                        columnList = "status"
                ),

                @Index(
                        name = "idx_pcr_reviewer",
                        columnList = "reviewed_by_person_id"
                ),

                @Index(
                        name = "idx_pcr_target",
                        columnList = "target_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;


    @Column(
            name = "candidate_person_id",
            nullable = false
    )
    private Long candidatePersonId;


    @Column(
            name = "request_type",
            nullable = false,
            length = 30
    )
    private String requestType;


    @Column(
            name = "operation_type",
            nullable = false,
            length = 10
    )
    private String operationType;

    @Column(name = "target_id")
    private Long targetId;


    @Column(
            name = "new_data",
            nullable = false,
            columnDefinition = "json"
    )
    private String newData;


    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private String status;


    @Column(name = "reviewed_by_person_id")
    private Long reviewedByPersonId;


    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;


    @Column(
            name = "rejection_reason",
            columnDefinition = "TEXT"
    )
    private String rejectionReason;


    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null || status.isBlank()) {
            status = "PENDING";
        }
    }
}