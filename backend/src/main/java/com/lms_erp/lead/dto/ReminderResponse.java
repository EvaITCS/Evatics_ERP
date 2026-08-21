//package com.lms_erp.lead.dto;
//
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class ReminderResponse {
//
//    // =====================================================
//    // REMINDER
//    // =====================================================
//
//    private Long reminderId;
//
//    // =====================================================
//    // LEAD (PERSON)
//    // =====================================================
//
//    private Long personId;
//
//    private String firstName;
//
//    private String middleName;
//
//    private String lastName;
//
//    private String email;
//
//    private String phone;
//
//    // =====================================================
//    // REMINDER
//    // =====================================================
//
//    private String reminderType;
//
//    private LocalDateTime reminderTime;
//
//    private Boolean completed;
//
//    // =====================================================
//    // ASSIGNED EMPLOYEE
//    // =====================================================
//
//    private Long employeePersonId;
//
//    private String employeeName;
//
//    // =====================================================
//    // LEAD STATUS
//    // =====================================================
//
//    private String leadStatus;
//}


package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {

    // =====================================================
    // REMINDER
    // =====================================================

    private Long reminderId;

    private String reminderType;

    private LocalDateTime reminderTime;

    private Boolean completed;

    // =====================================================
    // LEAD / PERSON
    // =====================================================

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String phone;

    // =====================================================
    // ASSIGNED EMPLOYEE
    // =====================================================

    private Long employeePersonId;

    private String employeeName;

    // =====================================================
    // LEAD STATUS
    // =====================================================

    private String leadStatus;

    // =====================================================
    // PENDING FOLLOW-UP COUNT
    //
    // Same person ke kitne pending followups hain.
    //
    // Example:
    // 5 Pending Followups
    // =====================================================



    // =====================================================
    // HIGHEST / MOST URGENT PENDING REMINDER
    //
    // Same person ke multiple reminders mein se
    // sabse urgent reminder.
    // =====================================================

    private Long highestPriorityReminderId;

    private LocalDateTime highestPriorityReminderTime;

    private String highestPriorityReminderType;
    private Integer pendingCount;
    private List<PendingFollowupResponse> pendingFollowups;

}