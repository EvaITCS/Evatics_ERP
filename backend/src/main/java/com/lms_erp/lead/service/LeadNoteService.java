package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.dto.LeadNoteRequest;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadNote;
import com.lms_erp.lead.repository.LeadNoteRepository;
import com.lms_erp.lead.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadNoteService {

    private final LeadRepository leadRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadNoteRepository leadNoteRepository;

    // =====================================
    // ADD NOTE
    // =====================================

    public void addNote(LeadNoteRequest request) {

        Lead lead = leadRepository
                .findByPersonIdWithDetails(request.getPersonId())
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        Employee employee = employeeRepository
                .findByPersonPersonId(request.getEmployeePersonId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        LeadNote note = LeadNote.builder()
                .lead(lead)
                .employee(employee)
                .noteText(request.getNoteText())
                .build();

        leadNoteRepository.save(note);
    }

    // =====================================
    // GET NOTES
    // =====================================

    public List<LeadNote> getLeadNotes(Long personId) {

        return leadNoteRepository
                .findByLead_PersonIdOrderByCreatedAtDesc(personId);
    }
}