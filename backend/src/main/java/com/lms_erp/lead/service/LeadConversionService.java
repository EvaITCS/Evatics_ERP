package com.lms_erp.lead.service;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.enums.LeadPriority;

import com.lms_erp.lead.repository.LeadRepository;

import com.lms_erp.lead.repository.LeadStatusHistoryRepository;
import com.lms_erp.lead.repository.LeadStatusMasterRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import com.lms_erp.lead.entity.LeadStatusHistory;
import com.lms_erp.lead.entity.LeadStatusMaster;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LeadConversionService {

    private final LeadRepository leadRepository;
    private final LeadStatusHistoryRepository
            leadStatusHistoryRepository;

    private final LeadStatusMasterRepository
            leadStatusMasterRepository;
    private final LeadScoreService
            leadScoreService;
    // =========================================
    // CONVERT LEAD
    // =========================================

    public Lead convertLead(Long leadId) {

        Lead lead =
                leadRepository.findById(leadId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lead not found"
                                ));

        LeadStatusMaster oldStatus =
                lead.getLeadStatus();

        LeadStatusMaster convertedStatus =
                getLeadStatus("CONVERTED");

        lead.setLeadPriority(
                LeadPriority.HOT
        );

        lead.setLeadStatus(
                convertedStatus
        );

        lead.setIsArchived(false);

        Lead savedLead =
                leadRepository.save(lead);

        saveStatusHistory(
                savedLead,
                oldStatus,
                convertedStatus
        );

        leadScoreService.updateScore(

                savedLead.getPersonId(),

                0,
                0,
                0,
                50,
                0
        );


        return savedLead;
    }
    // =========================================
    // INSERT LEAD
    // =========================================

    public Lead insertLead(Long leadId) {

        Lead lead =
                leadRepository.findById(leadId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lead not found"
                                ));

        LeadStatusMaster oldStatus =
                lead.getLeadStatus();

        LeadStatusMaster insertedStatus =
                getLeadStatus("INSERTED");

        lead.setLeadPriority(
                LeadPriority.WARM
        );

        lead.setLeadStatus(
                insertedStatus
        );

        Lead savedLead =
                leadRepository.save(lead);

        saveStatusHistory(
                savedLead,
                oldStatus,
                insertedStatus
        );

        leadScoreService.updateScore(

                savedLead.getPersonId(),

                0,
                0,
                0,
                30,
                0
        );

        return savedLead;
    }
    private void saveStatusHistory(
            Lead lead,
            LeadStatusMaster oldStatus,
            LeadStatusMaster newStatus
    ) {

        LeadStatusHistory history = new LeadStatusHistory();

        history.setLead(lead);

        history.setOldStatus(oldStatus);

        history.setNewStatus(newStatus);

        // Set the logged-in person's Person entity here
        // history.setChangedByPerson(currentUserService.getCurrentEmployee().getPerson());

        history.setRemarks("Status changed through lead conversion");

        leadStatusHistoryRepository.save(history);
    }
    // =========================================
    // ARCHIVE LEAD
    // =========================================

    public Lead archiveLead(Long leadId) {

        Lead lead =
                leadRepository.findById(leadId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lead not found"
                                ));

        lead.setIsArchived(true);

        Lead savedLead =
                leadRepository.save(lead);

        return savedLead;
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
}