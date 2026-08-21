package com.lms_erp.lead.controller;

import com.lms_erp.employee.dto.CounsellorDropdownResponse;
import com.lms_erp.lead.dto.LeadDistributionRequest;
import com.lms_erp.lead.dto.LeadImportJobResponse;
import com.lms_erp.lead.dto.LeadImportReportResponse;
import com.lms_erp.lead.entity.LeadImportJob;
import com.lms_erp.lead.service.LeadImportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lead-import")
@RequiredArgsConstructor
public class LeadImportController {

    private final LeadImportService leadImportService;

    // =====================================================
    // UPLOAD EXCEL
    // =====================================================
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeadImportJobResponse> uploadExcel(

            @RequestParam("file") MultipartFile file,

            @RequestParam
            String assignmentType,

            @RequestParam(required = false)
            Long counselorId
    ) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an Excel file.");
        }

        return ResponseEntity.ok(

                leadImportService.uploadFile(

                        file,

                        assignmentType,

                        counselorId
                )

        );
    }

    // =====================================================
    // DOWNLOAD REJECTED EXCEL
    // =====================================================
    @GetMapping("/download-rejected/{importJobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadRejectedExcel(
            @PathVariable Long importJobId
    ) throws IOException {

        File file = leadImportService.generateRejectedExcel(importJobId);

        if (file == null || !file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\""
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                .contentLength(file.length())
                .body(resource);
    }

    // =====================================================
    // IMPORT LEADS
    // =====================================================

    @PostMapping("/import/{importJobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> importLeads(
            @PathVariable Long importJobId
    ) {

        Integer imported =
                leadImportService.importLeads(importJobId);

        return ResponseEntity.ok(
                "Imported Leads : " + imported
        );
    }

    // =====================================================
    // ASSIGN IMPORTED LEADS
    // =====================================================

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignLeads(

            @Valid

            @RequestBody
            LeadDistributionRequest request
    ) {

        return ResponseEntity.ok(

                leadImportService.assignLeads(request)
        );
    }

    // =====================================================
    // GET COUNSELLORS
    // =====================================================

    @GetMapping("/counselors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CounsellorDropdownResponse>> getCounselors() {

        return ResponseEntity.ok(
                leadImportService.getCounselors()
        );
    }

    // =====================================================
    // IMPORT REPORT
    // =====================================================

    @GetMapping("/report/{importJobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeadImportReportResponse>> getImportReport(
            @PathVariable Long importJobId
    ) {

        return ResponseEntity.ok(
                leadImportService.getImportReport(importJobId)
        );
    }



    // =====================================================
    // IMPORT SUMMARY
    // =====================================================

    @GetMapping("/summary/{importJobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeadImportJobResponse> getSummary(

            @PathVariable Long importJobId
    ) {

        return ResponseEntity.ok(

                leadImportService.getSummary(importJobId)
        );
    }

    // =====================================================
    // CURRENT IMPORT JOB
    // =====================================================

    @GetMapping("/current")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeadImportJobResponse> getCurrentImportJob() {

        LeadImportJobResponse job =
                leadImportService.getCurrentImportJob();

        if (job == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(job);
    }

}
