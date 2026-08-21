package com.lms_erp.lead.scheduler;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadStatusMaster;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.LeadStatusMasterRepository;
import com.lms_erp.lead.service.FollowupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.lms_erp.lead.service.LeadAssignmentService;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReEngagementScheduler {

    private final LeadRepository leadRepository;
    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final LeadAssignmentService leadAssignmentService;
    private final FollowupService followupService;
    /**
     * Runs every day at midnight.
     * Re-engages archived leads after 6 months.
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void reEngageOldLeads() {

        LocalDateTime now = LocalDateTime.now();

        List<Lead> leads =
                leadRepository.findArchivedLeadsForReEngagement(now);

        LeadStatusMaster reEngagementStatus =
                getLeadStatus("RE_ENGAGEMENT");

        for (Lead lead : leads) {

            // =====================================
            // UNARCHIVE
            // =====================================

            lead.setIsArchived(false);

            // =====================================
            // RE-ENGAGEMENT STATUS
            // =====================================

            lead.setLeadStatus(reEngagementStatus);

            // =====================================
            // RESET PRIORITY
            // =====================================

            lead.setLeadPriority(LeadPriority.WARM);

            // =====================================
            // CLEAR RE-ENGAGEMENT DATE
            // =====================================

            lead.setReEngagementDate(null);

            // =====================================
            // NEXT FOLLOW-UP
            // =====================================

            lead.setNextFollowupDate(
                    LocalDateTime.now().plusDays(2)
            );

            leadRepository.save(lead);

            // =====================================
            // RESTORE PREVIOUS COUNSELLOR
            // =====================================

            leadAssignmentService
                    .reAssignToPreviousCounsellor(lead);

            // =====================================
            // CREATE RE-ENGAGEMENT FOLLOW-UP
            // =====================================

            followupService.createReEngagementFollowup(lead);
        }
    }

    private LeadStatusMaster getLeadStatus(String statusName) {

        return leadStatusMasterRepository
                .findByStatusName(statusName)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lead Status not found: " + statusName
                        )
                );
    }
}