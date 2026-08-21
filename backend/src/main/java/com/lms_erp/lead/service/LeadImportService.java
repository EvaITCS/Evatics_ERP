package com.lms_erp.lead.service;

import com.lms_erp.employee.dto.CounsellorDropdownResponse;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.lead.dto.LeadDistributionRequest;
import com.lms_erp.lead.dto.LeadImportJobResponse;
import com.lms_erp.lead.dto.LeadImportReportResponse;

import com.lms_erp.lead.entity.*;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.lead.repository.*;

import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonRepository;

import com.lms_erp.security.CurrentUserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Service
@RequiredArgsConstructor
public class LeadImportService {

    private final LeadImportJobRepository leadImportJobRepository;
    private final LeadImportStagingRepository leadImportStagingRepository;
    private final LeadRepository leadRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadAssignmentService leadAssignmentService;
    private final LeadImportMappingRepository leadImportMappingRepository;
    private final LeadDistributionHistoryRepository leadDistributionHistoryRepository;
    private final LeadImportAuditLogRepository leadImportAuditLogRepository;
    private final PersonRepository personRepository;
    private final PersonContactRepository personContactRepository;
    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final ContactTypeMasterRepository contactTypeRepository;
    private final CurrentUserService currentUserService;
    public LeadImportJobResponse uploadFile(
            MultipartFile file,
            String assignmentType,
            Long counselorId
    ) {

        try {

            Employee importer = currentUserService.getCurrentEmployee();

            Employee assignedEmployee = null;

            if ("MANUAL".equalsIgnoreCase(assignmentType) && counselorId != null) {

                assignedEmployee = employeeRepository
                        .findById(counselorId)
                        .orElseThrow(() ->
                                new RuntimeException("Assigned employee not found"));
            }

            LeadImportJob job = LeadImportJob.builder()
                    .originalFileName(file.getOriginalFilename())
                    .importedBy(importer)
                    .assignmentType(assignmentType)
                    .assignedEmployee(assignedEmployee)
                    .status("UPLOADED")
                    .build();

            LeadImportJob savedJob = leadImportJobRepository.save(job);

            LeadImportAuditLog auditLog =
                    LeadImportAuditLog.builder()
                            .importJob(savedJob)
                            .actionType("UPLOAD")
                            .actionBy(importer)
                            .description("Excel uploaded successfully")
                            .build();

            leadImportAuditLogRepository.save(auditLog);

            processExcel(
                    file,
                    savedJob,
                    assignmentType,
                    counselorId
            );

            return LeadImportJobResponse.builder()

                    .importJobId(savedJob.getImportJobId())

                    .originalFileName(savedJob.getOriginalFileName())

                    .status(savedJob.getStatus())

                    .totalRecords(savedJob.getTotalRecords())

                    .duplicateRecords(savedJob.getDuplicateRecords())

                    .invalidRecords(savedJob.getInvalidRecords())

                    .finalRecords(savedJob.getFinalRecords())

                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to upload excel: " + e.getMessage(),
                    e
            );
        }
    }

    private void processExcel(
            MultipartFile file,
            LeadImportJob job, String assignmentType,

            Long counselorId
    ) throws Exception {

        InputStream is =
                file.getInputStream();

        Workbook workbook =
                new XSSFWorkbook(is);

        System.out.println(
                "Total Sheets = "
                        + workbook.getNumberOfSheets()
        );

        for (int i = 0;
             i < workbook.getNumberOfSheets();
             i++) {

            System.out.println(
                    "Sheet Name = "
                            + workbook.getSheetName(i)
            );
        }

        // Student Data sheet
        Sheet sheet =
                workbook.getSheetAt(0);

        Row headerRow =
                sheet.getRow(0);

        int firstNameCol =
                findColumnIndex(
                        headerRow,
                        "first name",
                        "firstname",
                        "fname"
                        ,
                        "FullName",
                        "FIRST NAME"
                );

        int middleNameCol =
                findColumnIndex(
                        headerRow,
                        "middle name",
                        "middlename"
                );

        int lastNameCol =
                findColumnIndex(
                        headerRow,
                        "last name",
                        "lastname",
                        "surname"
                );

        int emailCol =
                findColumnIndex(
                        headerRow,
                        "email",
                        "email id",
                        "email address"
                );

        int phoneCol =
                findColumnIndex(
                        headerRow,
                        "phone",
                        "mobile",
                        "mobile no",
                        "contact number",
                        "phone number"
                );

        int visaTypeCol =
                findColumnIndex(
                        headerRow,
                        "visa type"
                );

        int visaStatusCol =
                findColumnIndex(
                        headerRow,
                        "visa status"
                );
        int totalRecords = 0;
        int counselorIndex = 0;
        int duplicateRecords = 0;

        int invalidRecords = 0;
        Set<String> uploadedEmails = new HashSet<>();

        for (
                int i = 1;
                i <= sheet.getLastRowNum();
                i++
        ) {

            Row row =
                    sheet.getRow(i);

            if (row == null) {
                continue;
            }

            String firstName =
                    firstNameCol >= 0
                            ? getCellValue(
                            row.getCell(firstNameCol)
                    )
                            : "";

            String middleName =
                    middleNameCol >= 0
                            ? getCellValue(
                            row.getCell(middleNameCol)
                    )
                            : "";

            String lastName =
                    lastNameCol >= 0
                            ? getCellValue(
                            row.getCell(lastNameCol)
                    )
                            : "";

            String email =
                    emailCol >= 0
                            ? getCellValue(
                            row.getCell(emailCol)
                    )
                            : "";

            String phone =
                    phoneCol >= 0
                            ? getCellValue(
                            row.getCell(phoneCol)
                    )
                            : "";

            String visaType =
                    visaTypeCol >= 0
                            ? getCellValue(
                            row.getCell(visaTypeCol)
                    )
                            : "";

            String visaStatus =
                    visaStatusCol >= 0
                            ? getCellValue(
                            row.getCell(visaStatusCol)
                    )
                            : "";
            boolean invalid = false;

            boolean duplicate = false;

            String rejectReason = "";

// ===============================
// FIRST NAME VALIDATION
// ===============================

            if (firstName == null || firstName.isBlank()) {

                invalid = true;

                rejectReason = "Missing First Name";
            }

// ===============================
// EMAIL REQUIRED
// ===============================

            if (email == null || email.isBlank()) {

                invalid = true;

                rejectReason = "Email is required";
            }

// ===============================
// EMAIL FORMAT VALIDATION
// ===============================

            if (!invalid) {

                String emailRegex =
                        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

                if (!email.matches(emailRegex)) {

                    invalid = true;

                    rejectReason = "Invalid Email Format";
                }
            }

// ===============================
// DUPLICATE EMAIL CHECK
// ===============================

            // ===============================
// DUPLICATE EMAIL CHECK
// ===============================

            if (!invalid) {

                String normalizedEmail =
                        email == null ? "" : email.trim().toLowerCase();

                // Duplicate Email inside uploaded Excel
                if (!normalizedEmail.isBlank()) {

                    if (!uploadedEmails.add(normalizedEmail)) {

                        duplicate = true;
                        rejectReason = "Duplicate Email found in uploaded Excel";
                    }
                }

                // Duplicate Email already exists in Database
                if (!duplicate && !normalizedEmail.isBlank()) {

                    if (personContactRepository.existsByContactValue(normalizedEmail)) {

                        duplicate = true;
                        rejectReason = "Email already exists in system";
                    }
                }
            }

            LeadImportStaging staging =
                    LeadImportStaging.builder()

                            .importJob(job)

                            .firstName(firstName)

                            .middleName(middleName)

                            .lastName(lastName)

                            .email(email)

                            .phone(phone)

                            .visaType(visaType)

                            .visaStatus(visaStatus)

                            .isDuplicate(duplicate)

                            .isInvalid(invalid)
                            .rejectReason(rejectReason)
                            .build();
            if (!duplicate && !invalid) {

                if ("MANUAL".equals(assignmentType)) {

                    Employee counselor =
                            employeeRepository
                                    .findById(counselorId)
                                    .orElseThrow(() ->
                                            new RuntimeException("Employee not found"));

                    staging.setAssignedEmployee(counselor);



                    staging.setAutoAssigned(false);

                } else {

                    Employee counselor =
                            getNextEmployee(counselorIndex);

                    staging.setAssignedEmployee(counselor);
                    staging.setAutoAssigned(true);

                    counselorIndex++;
                }
            }


            totalRecords++;

            if (duplicate) {

                duplicateRecords++;
            }

            if (invalid) {

                invalidRecords++;
            }

            leadImportStagingRepository
                    .save(staging);
        }

        job.setTotalRecords(
                totalRecords
        );

        job.setDuplicateRecords(
                duplicateRecords
        );

        job.setInvalidRecords(
                invalidRecords
        );

        job.setFinalRecords(
                totalRecords
                        - duplicateRecords
                        - invalidRecords
        );

        job.setStatus(
                "CLEANED"
        );

        leadImportJobRepository
                .save(job);
        LeadImportAuditLog auditLog =
                LeadImportAuditLog.builder()
                        .importJob(job)
                        .actionType("CLEAN")
                        .actionBy(job.getImportedBy())
                        .description("Excel validation completed")
                        .build();

        leadImportAuditLogRepository.save(auditLog);
        workbook.close();
    }


    private String getCellValue(
            Cell cell
    ) {

        if (cell == null) {

            return "";
        }

        return switch (
                cell.getCellType()
                ) {

            case STRING -> cell.getStringCellValue().trim();

            case NUMERIC -> DateUtil.isCellDateFormatted(cell)

                    ?

                    cell.getDateCellValue().toString()

                    :

                    String.valueOf(
                            cell.getNumericCellValue()
                    );

            case BOOLEAN -> String.valueOf(
                    cell.getBooleanCellValue()
            );

            case FORMULA -> {

                try {

                    yield cell
                            .getStringCellValue()
                            .trim();

                } catch (Exception e) {

                    yield String.valueOf(
                            cell.getNumericCellValue()
                    );
                }
            }

            default -> "";
        };
    }

    private int findColumnIndex(
            Row headerRow,
            String... possibleNames
    ) {

        if (headerRow == null) {
            return -1;
        }

        for (Cell cell : headerRow) {

            String header = getCellValue(cell);

            if (header == null || header.isBlank()) {
                continue;
            }

            header = header.trim().toLowerCase();

            for (String name : possibleNames) {

                if (header.equalsIgnoreCase(name.trim())) {
                    return cell.getColumnIndex();
                }
            }
        }

        return -1;
    }
    public File generateRejectedExcel(Long importJobId) throws IOException {

        List<LeadImportStaging> rejectedLeads =
                leadImportStagingRepository
                        .findByImportJob_ImportJobIdOrderByStagingIdAsc(importJobId)
                        .stream()
                        .filter(lead ->
                                Boolean.TRUE.equals(lead.getIsDuplicate()) ||
                                        Boolean.TRUE.equals(lead.getIsInvalid()))
                        .toList();

        Workbook workbook = new XSSFWorkbook();

        try {

            Sheet sheet = workbook.createSheet("Rejected Leads");

            Row header = sheet.createRow(0);

            String[] headers = {
                    "First Name",
                    "Middle Name",
                    "Last Name",
                    "Email",
                    "Phone",
                    "Visa Type",
                    "Visa Status",
                    "Reject Reason"
            };

            for (int i = 0; i < headers.length; i++) {
                header.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;

            for (LeadImportStaging lead : rejectedLeads) {

                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(safe(lead.getFirstName()));
                row.createCell(1).setCellValue(safe(lead.getMiddleName()));
                row.createCell(2).setCellValue(safe(lead.getLastName()));
                row.createCell(3).setCellValue(safe(lead.getEmail()));
                row.createCell(4).setCellValue(safe(lead.getPhone()));
                row.createCell(5).setCellValue(safe(lead.getVisaType()));
                row.createCell(6).setCellValue(safe(lead.getVisaStatus()));
                row.createCell(7).setCellValue(safe(lead.getRejectReason()));
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            File file = File.createTempFile(
                    "Rejected_Leads_" + importJobId + "_",
                    ".xlsx"
            );

            try (FileOutputStream fos = new FileOutputStream(file)) {
                workbook.write(fos);
            }

            return file;

        } finally {
            workbook.close();
        }
    }

    private String safe(String value) {

        if (value == null) {
            return "";
        }

        return value.trim().replace(",", " ");
    }



    @Transactional
    public Integer importLeads(Long importJobId) {


                List<LeadImportStaging> records =
                        leadImportStagingRepository
                                .findByImportJob_ImportJobIdAndIsDuplicateFalseAndIsInvalidFalseOrderByStagingIdAsc(importJobId);
        LeadImportJob importJob =
                leadImportJobRepository
                        .findById(importJobId)
                        .orElseThrow(() ->
                                new RuntimeException("Import Job not found"));

        int importedCount = 0;

        System.out.println("=====================================");
        System.out.println("IMPORT JOB ID : " + importJobId);
        System.out.println("EXPECTED VALID RECORDS : " + records.size());
        System.out.println("=====================================");

        for (LeadImportStaging row : records) {

            try {

                System.out.println("-------------------------------------");
                System.out.println("Processing : " + row.getEmail());

                // Duplicate check
                if (personContactRepository.existsByContactValue(row.getEmail())) {

                    System.out.println("DUPLICATE FOUND : " + row.getEmail());

                    row.setIsDuplicate(true);
                    row.setRejectReason("Email already exists in system");

                    leadImportStagingRepository.save(row);

                    continue;
                }

                Person person = Person.builder()
                        .firstName(row.getFirstName())
                        .middleName(row.getMiddleName())
                        .lastName(row.getLastName())
                        .build();

                person = personRepository.save(person);

                ContactTypeMaster emailType =
                        contactTypeRepository
                                .findByContactTypeNameIgnoreCase("PRIMARY_EMAIL")
                                .orElseThrow(() ->
                                        new RuntimeException("PRIMARY_EMAIL ContactType missing"));

                ContactTypeMaster phoneType =
                        contactTypeRepository
                                .findByContactTypeNameIgnoreCase("PRIMARY_PHONE")
                                .orElseThrow(() ->
                                        new RuntimeException("PRIMARY_PHONE ContactType missing"));
                if (row.getEmail() != null && !row.getEmail().isBlank()) {

                    PersonContact email = new PersonContact();

                    email.setPerson(person);
                    email.setContactType(emailType);
                    email.setContactValue(row.getEmail().trim());
                    email.setIsPrimary(true);

                    personContactRepository.save(email);
                }

                if (row.getPhone() != null && !row.getPhone().isBlank()) {

                    PersonContact phone = new PersonContact();

                    phone.setPerson(person);
                    phone.setContactType(phoneType);
                    phone.setContactValue(row.getPhone().trim());

                    personContactRepository.save(phone);
                }

                Lead lead = Lead.builder()
                        .person(person)
                        .importJob(importJob)
                        .leadStatus(getLeadStatus("NEW"))
                        .leadPriority(LeadPriority.WARM)
                        .computerExperience(false)
                        .isArchived(false)
                        .build();

                Lead savedLead = leadRepository.save(lead);

// =====================================
// CREATE INITIAL ASSIGNMENT
// =====================================

                if (row.getAssignedEmployee() != null) {

                    leadAssignmentService.assignLead(
                            savedLead,
                            row.getAssignedEmployee().getPersonId()
                    );
                }

// =====================================
// IMPORT MAPPING
// =====================================

                LeadImportMapping mapping =
                        LeadImportMapping.builder()
                                .importJob(importJob)
                                .lead(savedLead)
                                .build();

                leadImportMappingRepository.save(mapping);

                importedCount++;

                System.out.println("SUCCESS : " + row.getEmail());

            } catch (Exception e) {

                System.out.println("FAILED : " + row.getEmail());

                e.printStackTrace();

                row.setIsInvalid(true);
                row.setRejectReason(
                        e.getClass().getSimpleName() + " : " + e.getMessage()
                );

                leadImportStagingRepository.save(row);
            }
        }

        int duplicate = (int)
                leadImportStagingRepository
                        .countByImportJob_ImportJobIdAndIsDuplicateTrue(importJobId);

        int invalid = (int)
                leadImportStagingRepository
                        .countByImportJob_ImportJobIdAndIsInvalidTrue(importJobId);

        importJob.setDuplicateRecords(duplicate);
        importJob.setInvalidRecords(invalid);
        importJob.setFinalRecords(
                importedCount
        );
        importJob.setStatus("IMPORTED");

        leadImportJobRepository.save(importJob);

        System.out.println("=====================================");
        System.out.println("TOTAL IMPORTED : " + importedCount);
        System.out.println("TOTAL DUPLICATE : " + duplicate);
        System.out.println("TOTAL INVALID : " + invalid);
        System.out.println("=====================================");

        LeadImportAuditLog auditLog =
                LeadImportAuditLog.builder()
                        .importJob(importJob)
                        .actionType("IMPORT")
                        .actionBy(importJob.getImportedBy())
                        .description(importedCount + " Leads Imported")
                        .build();

        leadImportAuditLogRepository.save(auditLog);

        return importedCount;
    }



    @Transactional
    public String assignLeads(LeadDistributionRequest request) {

        // =========================================
        // FIND COUNSELLOR
        // =========================================

        Employee counselor =
                employeeRepository
                        .findByPersonPersonId(
                                request.getEmployeePersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Counsellor not found"
                                )
                        );

        // =========================================
        // FIND ADMIN
        // =========================================

        Employee admin =
                employeeRepository
                        .findByPersonPersonId(
                                request.getAssignedByPersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found"
                                )
                        );

        // =========================================
        // FIND IMPORT JOB
        // =========================================

        LeadImportJob importJob =
                leadImportJobRepository
                        .findById(request.getImportJobId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Import Job not found"
                                )
                        );

        // =========================================
        // FIND VALID STAGING LEADS
        // =========================================

        List<LeadImportStaging> stagingLeads =
                leadImportStagingRepository
                        .findByImportJob_ImportJobIdAndIsDuplicateFalseAndIsInvalidFalseOrderByStagingIdAsc(
                                request.getImportJobId()
                        );

        if (stagingLeads.isEmpty()) {

            return "No valid leads found for this import job.";
        }

        // =========================================
        // UPDATE STAGING ASSIGNMENT
        // =========================================

        for (LeadImportStaging staging : stagingLeads) {

            staging.setAssignedEmployee(counselor);
            staging.setAutoAssigned(false);
        }

        leadImportStagingRepository.saveAll(stagingLeads);

        // =========================================
        // UPDATE ACTUAL LEAD ASSIGNMENT
        // =========================================

        List<LeadImportMapping> mappings =
                leadImportMappingRepository
                        .findByImportJob_ImportJobId(
                                request.getImportJobId()
                        );

        int assignedLeadCount = 0;

        for (LeadImportMapping mapping : mappings) {

            Lead lead = mapping.getLead();

            if (lead == null) {
                continue;
            }

            leadAssignmentService.assignLead(
                    lead,
                    counselor.getPersonId()
            );

            assignedLeadCount++;
        }

        // =========================================
        // DISTRIBUTION HISTORY
        // =========================================

        LeadDistributionHistory history =
                LeadDistributionHistory.builder()
                        .importJob(importJob)
                        .assignedTo(counselor)
                        .assignedBy(admin)
                        .build();

        leadDistributionHistoryRepository.save(history);

        // =========================================
        // AUDIT LOG
        // =========================================

        LeadImportAuditLog auditLog =
                LeadImportAuditLog.builder()
                        .importJob(importJob)
                        .actionType("ASSIGN")
                        .actionBy(admin)
                        .description(
                                assignedLeadCount
                                        + " Leads Assigned to "
                                        + counselor.getPerson().getFirstName()
                        )
                        .build();

        leadImportAuditLogRepository.save(auditLog);

        // =========================================
        // RESPONSE
        // =========================================

        return assignedLeadCount
                + " leads assigned successfully to "
                + counselor.getPerson().getFirstName()
                + " "
                + counselor.getPerson().getLastName();
    }
    public List<LeadImportReportResponse> getImportReport(Long importJobId) {

        return leadImportStagingRepository
                .findByImportJob_ImportJobIdOrderByStagingIdAsc(importJobId)
                .stream()
                .filter(row ->
                        Boolean.TRUE.equals(row.getIsDuplicate())
                                || Boolean.TRUE.equals(row.getIsInvalid()))
                .map(row -> LeadImportReportResponse.builder()

                        .stagingId(row.getStagingId())

                        .firstName(row.getFirstName())

                        .middleName(row.getMiddleName())

                        .lastName(row.getLastName())

                        .email(row.getEmail())

                        .phone(row.getPhone())

                        .rejectReason(row.getRejectReason())

                        .createdAt(row.getCreatedAt())

                        .build())

                .toList();
    }

    public LeadImportJobResponse getSummary(Long importJobId) {

        LeadImportJob job =
                leadImportJobRepository
                        .findById(importJobId)
                        .orElseThrow(() ->
                                new RuntimeException("Import Job not found"));

        return LeadImportJobResponse.builder()

                .importJobId(job.getImportJobId())

                .originalFileName(job.getOriginalFileName())

                .status(job.getStatus())

                .totalRecords(job.getTotalRecords())

                .duplicateRecords(job.getDuplicateRecords())

                .invalidRecords(job.getInvalidRecords())

                .finalRecords(job.getFinalRecords())

                .build();
    }

    private Employee getNextEmployee(int index) {

        List<Employee> employees = employeeRepository.findAllCounsellors();

        if (employees.isEmpty()) {
            throw new RuntimeException("No counsellors found");
        }

        return employees.get(index % employees.size());
    }



    public LeadImportJobResponse getCurrentImportJob() {

        LeadImportJob job =
                leadImportJobRepository
                        .findFirstByStatusInOrderByImportJobIdDesc(
                                List.of(
                                        "UPLOADED",
                                        "CLEANED",
                                        "IMPORTED"
                                )
                        )
                        .orElse(null);

        if (job == null) {
            return null;
        }

        return LeadImportJobResponse.builder()
                .importJobId(job.getImportJobId())
                .originalFileName(job.getOriginalFileName())
                .status(job.getStatus())
                .totalRecords(job.getTotalRecords())
                .duplicateRecords(job.getDuplicateRecords())
                .invalidRecords(job.getInvalidRecords())
                .finalRecords(job.getFinalRecords())
                .build();
    }
    private LeadStatusMaster getLeadStatus(String statusName) {

        return leadStatusMasterRepository
                .findByStatusName(statusName)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lead Status not found : " + statusName
                        )
                );
    }

    public List<CounsellorDropdownResponse> getCounselors() {

        return employeeRepository.getCounsellorDropdown();
    }
}