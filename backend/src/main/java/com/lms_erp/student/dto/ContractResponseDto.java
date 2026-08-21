package com.lms_erp.student.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractResponseDto {

    private Long contractId;

    private Long batchId;

    private String batchName;

    private String fileName;

    private Long uploadedByPersonId;

    private LocalDateTime uploadedAt;

    private String status;


    // =====================================================
    // CANDIDATE CONTRACT
    // =====================================================

    private Long candidateContractId;

    private String signatureStatus;

    private String signatureType;

    private String signatureData;

    private LocalDateTime signedAt;
}