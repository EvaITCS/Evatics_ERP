package com.lms_erp.lead.scheduler;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.service.LeadAssignmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AutoAssignmentScheduler {

    private final LeadAssignmentService assignmentService;

    /*
     * Every 10 minutes
     */
    @Scheduled(fixedRate = 1800000)
    public void autoAssignLeads() {

        List<Lead> unassignedLeads =
                assignmentService.getUnassignedLeads();

        for (Lead lead : unassignedLeads) {

            assignmentService.autoAssignLead(lead);
        }
    }
}