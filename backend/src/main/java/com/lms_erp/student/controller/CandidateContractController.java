package com.lms_erp.student.controller;

import com.lms_erp.student.dto.ContractResponseDto;
import com.lms_erp.student.entity.Contract;
import com.lms_erp.student.service.ContractService;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student/contracts")
@RequiredArgsConstructor
public class CandidateContractController {

    private final ContractService contractService;
    private final UserRepository userRepository;

    @GetMapping("/my-contract")
    public ResponseEntity<ContractResponseDto> getMyContract(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found."));

        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            throw new RuntimeException("Person is not associated with logged-in user.");
        }

        return ResponseEntity.ok(
                contractService.getMyContract(
                        user.getPerson().getPersonId()
                )
        );
    }

    @GetMapping("/{contractId}/file")
    public ResponseEntity<Resource> viewContract(
            @PathVariable Long contractId,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found."));

        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            throw new RuntimeException("Person is not associated with logged-in user.");
        }

        Contract contract = contractService.getContractForStudent(
                contractId,
                user.getPerson().getPersonId()
        );

        if (contract.getFileData() == null || contract.getFileData().length == 0) {
            throw new RuntimeException("Contract file data is empty.");
        }

        MediaType mediaType = MediaType.APPLICATION_PDF;

        if (contract.getContentType() != null &&
                !contract.getContentType().isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(
                        contract.getContentType()
                );
            } catch (Exception ignored) {
                mediaType = MediaType.APPLICATION_PDF;
            }
        }

        ByteArrayResource resource = new ByteArrayResource(
                contract.getFileData()
        );

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(contract.getFileData().length)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + contract.getFileName() + "\""
                )
                .body(resource);
    }

    @PostMapping(
            value = "/{candidateContractId}/sign",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<ContractResponseDto> signContract(
            @PathVariable Long candidateContractId,
            @RequestParam("signatureType") String signatureType,
            @RequestParam(value = "signatureData", required = false) String signatureData,
            @RequestParam(value = "signatureFile", required = false) MultipartFile signatureFile,
            Authentication authentication
    ) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found."));

        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            throw new RuntimeException("Person is not associated with logged-in user.");
        }

        return ResponseEntity.ok(
                contractService.signContract(
                        candidateContractId,
                        user.getPerson().getPersonId(),
                        signatureType,
                        signatureData,
                        signatureFile
                )
        );
    }
}