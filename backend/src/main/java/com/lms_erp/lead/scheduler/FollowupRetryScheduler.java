package com.lms_erp.lead.scheduler;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.ReminderSchedule;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Component
@RequiredArgsConstructor
public class FollowupRetryScheduler {

    private final ReminderScheduleRepository reminderRepository;
    private final FollowupRepository followupRepository;
    private final LeadRepository leadRepository;


    // =====================================================
    // RUN EVERY 10 SECONDS
    // =====================================================

    @Scheduled(fixedRate = 1800000)
    public void processMissedFollowups() {

        System.out.println(
                "===== FOLLOWUP RETRY SCHEDULER RUNNING ====="
        );

        LocalDateTime now = LocalDateTime.now();

        List<ReminderSchedule> reminders =
                reminderRepository.findAllPendingReminders(now);

        System.out.println(
                "Missed reminders found : "
                        + reminders.size()
        );


        for (ReminderSchedule reminder : reminders) {

            try {

                processRetry(reminder);

            } catch (Exception e) {

                System.err.println(
                        "Error processing reminder : "
                                + reminder.getReminderId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // PROCESS MISSED FOLLOW-UP
    // =====================================================

    private void processRetry(
            ReminderSchedule reminder
    ) {

        LeadFollowup currentFollowup =
                reminder.getFollowup();

        if (currentFollowup == null) {
            return;
        }


        Lead lead =
                currentFollowup.getLead();

        if (lead == null) {
            return;
        }


        // =====================================================
        // CHECK LEAD STATUS
        // =====================================================

        String status =
                lead.getLeadStatus() != null
                        ? lead.getLeadStatus().getStatusName()
                        : "";


        // =====================================================
        // STOP AUTO RETRY FOR CLOSED LEADS
        // =====================================================

        if (
                "INTERESTED".equals(status)
                        || "CONVERTED".equals(status)
                        || "NOT_INTERESTED".equals(status)
                        || "CLOSED".equals(status)
        ) {

            /*
             * IMPORTANT:
             *
             * DO NOT MARK OLD REMINDER AS COMPLETED.
             *
             * User did not complete this reminder.
             *
             * Therefore:
             *
             * is_completed remains FALSE
             *
             * so it can still appear in Overdue history.
             */

            System.out.println(
                    "Retry stopped for Lead "
                            + lead.getPersonId()
                            + " | Status = "
                            + status
            );

            return;
        }


        // =====================================================
        // FIND FOLLOWUPS OF THIS LEAD
        // =====================================================

        Long personId =
                lead.getPersonId();

        List<LeadFollowup> followups =
                followupRepository.findLeadFollowups(
                        personId
                );


        if (followups.isEmpty()) {
            return;
        }


        // =====================================================
        // GET LATEST FOLLOW-UP
        // =====================================================

        LeadFollowup latest =
                followups.get(0);


        int retryCount =
                latest.getRetryCount() == null
                        ? 0
                        : latest.getRetryCount();


        // =====================================================
        // CALCULATE NEXT REMINDER
        // =====================================================

        LocalDateTime nextReminder =
                calculateNextReminder(
                        retryCount
                );


        // =====================================================
        // MAX RETRIES REACHED
        // =====================================================

        if (nextReminder == null) {

            /*
             * Archive lead after maximum retries.
             */

            lead.setIsArchived(true);

            lead.setNextFollowupDate(null);

            leadRepository.save(lead);


            /*
             * IMPORTANT:
             *
             * Do NOT mark current reminder completed.
             *
             * It remains:
             *
             * is_completed = false
             *
             * so that it remains visible as overdue.
             */

            System.out.println(
                    "Maximum retries reached. "
                            + "Lead archived : "
                            + lead.getPersonId()
            );

            return;
        }


        // =====================================================
        // DUPLICATE FOLLOW-UP PROTECTION
        // =====================================================

        boolean alreadyExists =
                followupRepository
                        .existsByLead_PersonIdAndScheduledAt(
                                lead.getPersonId(),
                                nextReminder
                        );


        if (alreadyExists) {

            /*
             * DO NOT COMPLETE OLD REMINDER.
             *
             * It is still an incomplete missed reminder.
             */

            System.out.println(
                    "Retry already exists for Lead : "
                            + lead.getPersonId()
            );

            return;
        }


        // =====================================================
        // CREATE NEW AUTO RETRY FOLLOW-UP
        // =====================================================

        LeadFollowup retryFollowup =
                new LeadFollowup();


        retryFollowup.setLead(
                lead
        );


        retryFollowup.setEmployee(
                currentFollowup.getEmployee()
        );


        retryFollowup.setFollowupType(
                latest.getFollowupType()
        );


        retryFollowup.setFollowupStatus(
                FollowupStatus.PENDING
        );


        retryFollowup.setRemarks(
                "AUTO RETRY"
        );


        retryFollowup.setRetryCount(
                retryCount + 1
        );


        retryFollowup.setNextFollowupAt(
                nextReminder
        );


        retryFollowup.setScheduledAt(
                nextReminder
        );


        // =====================================================
        // SAVE NEW FOLLOW-UP
        // =====================================================

        LeadFollowup savedRetry =
                followupRepository.save(
                        retryFollowup
                );


        // =====================================================
        // CREATE NEW REMINDER
        // =====================================================

        ReminderSchedule newReminder =
                ReminderSchedule.builder()

                        .followup(
                                savedRetry
                        )

                        .reminderTime(
                                nextReminder
                        )

                        .reminderType(
                                "AUTO_RETRY"
                        )

                        .isCompleted(
                                false
                        )

                        .notificationSent(
                                false
                        )

                        .build();


        reminderRepository.save(
                newReminder
        );


        // =====================================================
        // UPDATE LEAD NEXT FOLLOW-UP
        // =====================================================

        lead.setNextFollowupDate(
                nextReminder
        );


        leadRepository.save(
                lead
        );


        // =====================================================
        // IMPORTANT
        // =====================================================

        /*
         * DO NOT DO THIS:
         *
         * reminder.setIsCompleted(true);
         * reminderRepository.save(reminder);
         *
         * Because the old reminder was NOT completed
         * by the counsellor.
         *
         * It must remain overdue.
         */


        System.out.println(
                "Auto Retry Created : Lead "
                        + lead.getPersonId()
                        + " | Retry "
                        + (retryCount + 1)
                        + " | Next Reminder "
                        + nextReminder
        );
    }


    // =====================================================
    // RETRY PATTERN
    // =====================================================



    private LocalDateTime calculateNextReminder(
            int retryCount) {

        LocalDateTime now = LocalDateTime.now();

        return switch (retryCount) {

            // First retry
            case 0 -> now.plusHours(1);

            // Second retry
            case 1 -> now.plusHours(2);

            // Third retry
            case 2 -> now.plusHours(4);

            // Fourth retry
            case 3 -> now.plusHours(8);

            // Fifth retry
            case 4 -> now.plusHours(16);

            // Sixth retry
            case 5 -> now.plusHours(24);

            // Seventh retry
            case 6 -> now.plusHours(36);
            case 7 -> now.plusHours(48);

            // Eighth retry
            case 9 -> now.plusWeeks(1);

            // Ninth retry
            case 10 -> now.plusWeeks(2);

            // Retry chain finished
            default -> null;
        };
    }
}