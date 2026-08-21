package com.lms_erp.student.controller;

import com.lms_erp.student.dto.ContractResponseDto;
import com.lms_erp.student.entity.Contract;
import com.lms_erp.student.service.ContractService;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/contracts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContractController {

    private final ContractService contractService;
    private final UserRepository userRepository;


    // =====================================================
    // UPLOAD CONTRACT
    // =====================================================

    @PostMapping
    public ResponseEntity<ContractResponseDto> uploadContract(

            @RequestParam("batchId")
            Long batchId,

            @RequestParam("file")
            MultipartFile file,

            Authentication authentication
    ) {

        String username = authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Logged-in user not found."
                                )
                        );


        if (user.getPerson() == null ||
                user.getPerson().getPersonId() == null) {

            throw new RuntimeException(
                    "Person is not associated with logged-in user."
            );
        }


        Long uploadedByPersonId =
                user.getPerson().getPersonId();


        ContractResponseDto response =
                contractService.uploadContract(
                        batchId,
                        file,
                        uploadedByPersonId
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // GET ALL ACTIVE CONTRACTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<ContractResponseDto>>
    getAllContracts() {

        return ResponseEntity.ok(
                contractService.getAllContracts()
        );
    }


    // =====================================================
    // GET CONTRACTS BY BATCH
    // =====================================================

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<ContractResponseDto>>
    getContractsByBatch(
            @PathVariable Long batchId
    ) {

        return ResponseEntity.ok(
                contractService.getContractsByBatch(batchId)
        );
    }
    @GetMapping("/{contractId}/file")
    public ResponseEntity<byte[]> viewContract(
            @PathVariable Long contractId
    ) {
        Contract contract =
                contractService.getContractEntity(contractId);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                contract.getContentType()
                        )
                )
                .contentLength(contract.getFileSize())
                .header(
                        "Content-Disposition",
                        "inline; filename=\"" +
                                contract.getFileName() +
                                "\""
                )
                .body(contract.getFileData());
    }
}