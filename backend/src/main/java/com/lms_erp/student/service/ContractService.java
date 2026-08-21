package com.lms_erp.student.service;

import com.lms_erp.student.dto.ContractResponseDto;
import com.lms_erp.student.entity.Contract;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ContractService {

    ContractResponseDto uploadContract(
            Long batchId,
            MultipartFile file,
            Long uploadedByPersonId
    );

    List<ContractResponseDto> getContractsByBatch(Long batchId);

    List<ContractResponseDto> getAllContracts();

    ContractResponseDto getMyContract(Long personId);

    Contract getContractEntity(Long contractId);

    ContractResponseDto signContract(
            Long candidateContractId,
            Long personId,
            String signatureType,
            String signatureData,
            MultipartFile signatureFile
    );

    Contract getContractForStudent(Long contractId, Long personId);
}