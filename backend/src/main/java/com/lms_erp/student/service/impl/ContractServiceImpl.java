package com.lms_erp.student.service.impl;

import com.lms_erp.batch.entity.Batch;
import com.lms_erp.batch.repository.BatchRepository;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.lead.repository.NotificationRepository;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonDocument;
import com.lms_erp.person.repository.PersonDocumentRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.student.dto.ContractResponseDto;
import com.lms_erp.student.entity.CandidateContract;
import com.lms_erp.student.entity.Contract;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.enums.CandidateContractStatus;
import com.lms_erp.student.enums.ContractStatus;
import com.lms_erp.student.repository.CandidateContractRepository;
import com.lms_erp.student.repository.ContractRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.student.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final BatchRepository batchRepository;
    private final PersonRepository personRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final StudentBatchRepository studentBatchRepository;
    private final CandidateContractRepository candidateContractRepository;
    private final NotificationRepository notificationRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public ContractResponseDto uploadContract(
            Long batchId,
            MultipartFile file,
            Long uploadedByPersonId
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Contract PDF is required.");
        }

        String fileName = file.getOriginalFilename();
        String contentType = file.getContentType();

        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Contract filename is missing.");
        }

        if (!fileName.toLowerCase().endsWith(".pdf")
                || !"application/pdf".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Batch not found with id: " + batchId));

        Person uploadedBy = personRepository.findById(uploadedByPersonId)
                .orElseThrow(() ->
                        new RuntimeException("Person not found with id: " + uploadedByPersonId));

        try {
            Contract contract = Contract.builder()
                    .batch(batch)
                    .fileName(fileName)
                    .uploadedBy(uploadedBy)
                    .status(ContractStatus.ACTIVE)
                    .fileData(file.getBytes())
                    .contentType(contentType)
                    .fileSize(file.getSize())
                    .build();

            Contract savedContract = contractRepository.save(contract);

            notifyStudentsAboutContractUpload(batch);

            return mapToResponse(savedContract);

        } catch (IOException e) {
            throw new RuntimeException("Failed to save contract file.", e);
        }
    }

    private void notifyStudentsAboutContractUpload(Batch batch) {
        List<StudentBatch> studentBatches =
                studentBatchRepository.findByBatchBatchId(batch.getBatchId());

        for (StudentBatch studentBatch : studentBatches) {
            if (studentBatch == null) {
                continue;
            }

            StudentApplication application =
                    studentBatch.getStudentApplication();

            if (application == null || application.getPersonId() == null) {
                continue;
            }

            LeadNotification notification = LeadNotification.builder()
                    .employee(null)
                    .student(application)
                    .lead(null)
                    .title("New Contract Available")
                    .message(
                            "Your contract has been uploaded and is ready for review. " +
                                    "Please visit the Contract section, review the document, " +
                                    "and complete your signature."
                    )
                    .notificationType(NotificationType.CONTRACT_UPLOADED)
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponseDto> getContractsByBatch(Long batchId) {
        if (!batchRepository.existsById(batchId)) {
            throw new RuntimeException("Batch not found with id: " + batchId);
        }

        return contractRepository
                .findByBatch_BatchIdAndStatus(
                        batchId,
                        ContractStatus.ACTIVE
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponseDto> getAllContracts() {
        return contractRepository
                .findByStatus(ContractStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ContractResponseDto getMyContract(Long personId) {
        StudentBatch studentBatch =
                studentBatchRepository
                        .findByStudentApplicationPersonPersonId(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student is not assigned to any batch."
                                ));

        Batch batch = studentBatch.getBatch();

        if (batch == null || batch.getBatchId() == null) {
            throw new RuntimeException("Student batch information is invalid.");
        }

        List<Contract> contracts =
                contractRepository.findByBatch_BatchIdAndStatus(
                        batch.getBatchId(),
                        ContractStatus.ACTIVE
                );

        if (contracts.isEmpty()) {
            throw new RuntimeException("No active contract found for your batch.");
        }

        Contract contract = contracts.get(0);

        CandidateContract candidateContract =
                candidateContractRepository
                        .findByContractContractIdAndCandidatePersonId(
                                contract.getContractId(),
                                personId
                        )
                        .orElseGet(() -> {
                            CandidateContract newContract =
                                    CandidateContract.builder()
                                            .contract(contract)
                                            .candidate(
                                                    studentBatch.getStudentApplication()
                                            )
                                            .status(
                                                    CandidateContractStatus.PENDING
                                            )
                                            .build();

                            return candidateContractRepository.save(newContract);
                        });

        return mapToResponse(contract, candidateContract);
    }

    @Override
    public ContractResponseDto signContract(
            Long candidateContractId,
            Long personId,
            String signatureType,
            String signatureData,
            MultipartFile signatureFile
    ) {
        CandidateContract candidateContract =
                candidateContractRepository.findById(candidateContractId)
                        .orElseThrow(() ->
                                new RuntimeException("Contract record not found."));

        if (candidateContract.getCandidate() == null
                || candidateContract.getCandidate().getPersonId() == null
                || !candidateContract.getCandidate()
                .getPersonId()
                .equals(personId)) {
            throw new RuntimeException(
                    "You are not authorized to sign this contract."
            );
        }

        if (candidateContract.getStatus() == CandidateContractStatus.SIGNED) {
            throw new RuntimeException("Contract has already been signed.");
        }

        if (signatureType == null || signatureType.isBlank()) {
            throw new IllegalArgumentException("Signature type is required.");
        }

        String normalizedSignatureType =
                signatureType.trim().toUpperCase();

        String finalSignatureData;

        if ("TYPED".equals(normalizedSignatureType)) {
            if (signatureData == null || signatureData.isBlank()) {
                throw new IllegalArgumentException("Signature is required.");
            }

            finalSignatureData = signatureData.trim();

        } else if ("UPLOADED".equals(normalizedSignatureType)) {

            if (signatureFile == null || signatureFile.isEmpty()) {
                throw new IllegalArgumentException("Signature file is required.");
            }

            String contentType = signatureFile.getContentType();

            if (!"image/png".equalsIgnoreCase(contentType)
                    && !"image/jpeg".equalsIgnoreCase(contentType)) {
                throw new IllegalArgumentException(
                        "Only PNG or JPG signature files are allowed."
                );
            }

            if (signatureFile.getSize() > 2 * 1024 * 1024) {
                throw new IllegalArgumentException(
                        "Signature image must not exceed 2 MB."
                );
            }

            Person person = personRepository.findById(personId)
                    .orElseThrow(() ->
                            new RuntimeException("Person not found."));

            try {
                PersonDocument signatureDocument = new PersonDocument();

                signatureDocument.setPerson(person);
                signatureDocument.setDocumentType("Contract Signature");
                signatureDocument.setFileName(
                        signatureFile.getOriginalFilename()
                );
                signatureDocument.setFileData(
                        signatureFile.getBytes()
                );
                signatureDocument.setContentType(contentType);
                signatureDocument.setFileSize(signatureFile.getSize());

                PersonDocument savedDocument =
                        personDocumentRepository.save(signatureDocument);

                finalSignatureData =
                        "/api/person-documents/"
                                + savedDocument.getPersonDocumentId()
                                + "/file";

            } catch (IOException e) {
                throw new RuntimeException(
                        "Failed to save signature file.",
                        e
                );
            }

        } else {
            throw new IllegalArgumentException(
                    "Invalid signature type. Allowed values are TYPED or UPLOADED."
            );
        }

        candidateContract.setSignatureType(normalizedSignatureType);
        candidateContract.setSignatureData(finalSignatureData);
        candidateContract.setStatus(CandidateContractStatus.SIGNED);
        candidateContract.setSignedAt(LocalDateTime.now());

        CandidateContract savedContract =
                candidateContractRepository.save(candidateContract);

        notifyAdminsAboutContractSigning(savedContract);

        return mapToResponse(
                savedContract.getContract(),
                savedContract
        );
    }

    private void notifyAdminsAboutContractSigning(
            CandidateContract candidateContract
    ) {
        if (candidateContract == null
                || candidateContract.getCandidate() == null) {
            return;
        }

        StudentApplication application =
                candidateContract.getCandidate();

        String studentName =
                application.getPerson() != null
                        ? buildStudentName(application.getPerson())
                        : "Student";

        String batchName =
                candidateContract.getContract() != null
                        && candidateContract.getContract().getBatch() != null
                        ? candidateContract.getContract()
                          .getBatch()
                          .getBatchName()
                        : "your batch";

        for (Employee employee : employeeRepository.findAll()) {
            if (employee == null || employee.getPersonId() == null) {
                continue;
            }

            if (!isAdminEmployee(employee.getPersonId())) {
                continue;
            }

            LeadNotification notification =
                    LeadNotification.builder()
                            .employee(employee)
                            .student(null)
                            .lead(null)
                            .title("Contract Signed")
                            .message(
                                    studentName +
                                            " has signed the contract for " +
                                            batchName + "."
                            )
                            .notificationType(
                                    NotificationType.CONTRACT_SIGNED
                            )
                            .isRead(false)
                            .build();

            notificationRepository.save(notification);
        }
    }

    private boolean isAdminEmployee(Long employeePersonId) {
        return false;
    }

    private String buildStudentName(Person person) {
        String firstName =
                person.getFirstName() != null
                        ? person.getFirstName()
                        : "";

        String lastName =
                person.getLastName() != null
                        ? person.getLastName()
                        : "";

        String fullName =
                (firstName + " " + lastName).trim();

        return fullName.isBlank() ? "Student" : fullName;
    }

    private ContractResponseDto mapToResponse(Contract contract) {
        return ContractResponseDto.builder()
                .contractId(contract.getContractId())
                .batchId(contract.getBatch().getBatchId())
                .batchName(contract.getBatch().getBatchName())
                .fileName(contract.getFileName())
                .uploadedByPersonId(
                        contract.getUploadedBy().getPersonId()
                )
                .uploadedAt(contract.getUploadedAt())
                .status(contract.getStatus().name())
                .build();
    }

    private ContractResponseDto mapToResponse(
            Contract contract,
            CandidateContract candidateContract
    ) {
        return ContractResponseDto.builder()
                .contractId(contract.getContractId())
                .candidateContractId(
                        candidateContract.getCandidateContractId()
                )
                .batchId(contract.getBatch().getBatchId())
                .batchName(contract.getBatch().getBatchName())
                .fileName(contract.getFileName())
                .uploadedByPersonId(
                        contract.getUploadedBy().getPersonId()
                )
                .uploadedAt(contract.getUploadedAt())
                .status(candidateContract.getStatus().name())
                .signatureStatus(candidateContract.getStatus().name())
                .signatureType(candidateContract.getSignatureType())
                .signatureData(candidateContract.getSignatureData())
                .signedAt(candidateContract.getSignedAt())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public Contract getContractEntity(Long contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contract not found with id: " + contractId
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public Contract getContractForStudent(Long contractId, Long personId) {
        StudentBatch studentBatch = studentBatchRepository
                .findByStudentApplicationPersonPersonId(personId)
                .orElseThrow(() -> new RuntimeException(
                        "Student is not assigned to any batch."
                ));

        Contract contract = contractRepository
                .findById(contractId)
                .orElseThrow(() -> new RuntimeException(
                        "Contract not found."
                ));

        if (contract.getBatch() == null ||
                studentBatch.getBatch() == null ||
                !contract.getBatch().getBatchId()
                        .equals(studentBatch.getBatch().getBatchId())) {
            throw new RuntimeException(
                    "You are not authorized to view this contract."
            );
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException(
                    "Contract is not active."
            );
        }

        return contract;
    }
}