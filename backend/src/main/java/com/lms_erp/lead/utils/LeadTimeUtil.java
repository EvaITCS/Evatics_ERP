package com.lms_erp.lead.utils;

import java.time.Duration;
import java.time.LocalDateTime;

public class LeadTimeUtil {

    /*
     * PRIVATE CONSTRUCTOR
     */
    private LeadTimeUtil() {
    }

    // ==========================================
    // GET LEAD AGE
    // Example:
    // 1 Years 2 Months 5 Days 4 Hours
    // ==========================================

    public static String getLeadAge(
            LocalDateTime createdAt
    ) {

        if (createdAt == null) {
            return "N/A";
        }

        Duration duration =
                Duration.between(
                        createdAt,
                        LocalDateTime.now()
                );

        long totalHours =
                duration.toHours();

        long days =
                totalHours / 24;

        long years =
                days / 365;

        long months =
                (days % 365) / 30;

        long remainingDays =
                (days % 365) % 30;

        long hours =
                totalHours % 24;

        return years + " Years "
                + months + " Months "
                + remainingDays + " Days "
                + hours + " Hours";
    }

    // ==========================================
    // HOURS SINCE CREATED
    // ==========================================

    public static long getHoursSinceCreated(
            LocalDateTime createdAt
    ) {

        if (createdAt == null) {
            return 0;
        }

        return Duration.between(
                createdAt,
                LocalDateTime.now()
        ).toHours();
    }

    // ==========================================
    // DAYS SINCE CREATED
    // ==========================================

    public static long getDaysSinceCreated(
            LocalDateTime createdAt
    ) {

        if (createdAt == null) {
            return 0;
        }

        return Duration.between(
                createdAt,
                LocalDateTime.now()
        ).toDays();
    }

    // ==========================================
    // IS FOLLOWUP OVERDUE
    // ==========================================

    public static boolean isFollowupOverdue(
            LocalDateTime followupDate
    ) {

        if (followupDate == null) {
            return false;
        }

        return followupDate.isBefore(
                LocalDateTime.now()
        );
    }

    // ==========================================
    // TIME LEFT FOR FOLLOWUP
    // ==========================================

    public static String getTimeLeftForFollowup(
            LocalDateTime followupDate
    ) {

        if (followupDate == null) {
            return "No Follow-Up";
        }

        Duration duration =
                Duration.between(
                        LocalDateTime.now(),
                        followupDate
                );

        if (duration.isNegative()) {
            return "Overdue";
        }

        long hours =
                duration.toHours();

        long days =
                hours / 24;

        long remainingHours =
                hours % 24;

        return days + " Days "
                + remainingHours + " Hours Left";
    }
}
