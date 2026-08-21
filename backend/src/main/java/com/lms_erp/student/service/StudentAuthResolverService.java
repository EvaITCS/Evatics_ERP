package com.lms_erp.student.service;

import com.lms_erp.student.enums.StudentDashboardType;
import org.springframework.stereotype.Service;

@Service
public class StudentAuthResolverService {

    public StudentDashboardType resolve(
            Long statusId
    ) {

        if (statusId == 3L) {
            return StudentDashboardType.WAITING_BATCH;
        }

        return StudentDashboardType.BASIC;
    }
}