package com.lms_erp.lead.service;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadScore;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.LeadScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LeadScoreService {

    private final LeadRepository leadRepository;
    private final LeadScoreRepository leadScoreRepository;

    // =====================================================
    // CREATE INITIAL SCORE
    // =====================================================

    public void createInitialScore(Long personId) {

        Lead lead = leadRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        LeadScore leadScore = LeadScore.builder()
                .lead(lead)
                .callScore(0)
                .emailScore(0)
                .followupScore(0)
                .engagementScore(0)
                .documentScore(0)
                .totalScore(0)
                .leadPriority(LeadPriority.WARM)
                .build();

        leadScoreRepository.save(leadScore);
    }

    // =====================================================
    // UPDATE SCORE
    // =====================================================

    public void updateScore(
            Long personId,
            Integer call,
            Integer email,
            Integer followup,
            Integer engagement,
            Integer document
    ) {

        LeadScore leadScore = leadScoreRepository
                .findByLead_PersonId(personId)
                .orElseGet(() -> {

                    Lead lead = leadRepository.findById(personId)
                            .orElseThrow(() ->
                                    new RuntimeException("Lead not found"));

                    LeadScore newScore = LeadScore.builder()
                            .lead(lead)
                            .callScore(0)
                            .emailScore(0)
                            .followupScore(0)
                            .engagementScore(0)
                            .documentScore(0)
                            .totalScore(0)
                            .leadPriority(LeadPriority.WARM)
                            .build();

                    return leadScoreRepository.save(newScore);
                });

        leadScore.setCallScore(
                safe(leadScore.getCallScore()) + safe(call));

        leadScore.setEmailScore(
                safe(leadScore.getEmailScore()) + safe(email));

        leadScore.setFollowupScore(
                safe(leadScore.getFollowupScore()) + safe(followup));

        leadScore.setEngagementScore(
                safe(leadScore.getEngagementScore()) + safe(engagement));

        leadScore.setDocumentScore(
                safe(leadScore.getDocumentScore()) + safe(document));

        int total = leadScore.getCallScore()
                + leadScore.getEmailScore()
                + leadScore.getFollowupScore()
                + leadScore.getEngagementScore()
                + leadScore.getDocumentScore();

        leadScore.setTotalScore(total);

        updatePriority(leadScore, total);

        leadScoreRepository.save(leadScore);
    }

    // =====================================================
    // PRIORITY CALCULATION
    // =====================================================

    private void updatePriority(
            LeadScore leadScore,
            int total
    ) {

        if (total >= 80) {
            leadScore.setLeadPriority(LeadPriority.HOT);
        } else if (total >= 40) {
            leadScore.setLeadPriority(LeadPriority.WARM);
        } else {
            leadScore.setLeadPriority(LeadPriority.COLD);
        }
    }

    // =====================================================
    // SAFE INTEGER
    // =====================================================

    private Integer safe(Integer value) {
        return value == null ? 0 : value;
    }
}