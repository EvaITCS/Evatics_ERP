package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.EmployeeActivityLogResponse;
import com.lms_erp.employee.entity.EmployeeActivityLog;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class EmployeeActivityLogMapper {

    public EmployeeActivityLogResponse mapToResponse(
            EmployeeActivityLog activityLog
    ) {

        return EmployeeActivityLogResponse.builder()

                .activityLogId(
                        activityLog.getActivityLogId()
                )

                .personId(
                        activityLog.getEmployee() != null
                                ? activityLog.getEmployee().getPersonId()
                                : null
                )

                .employeeName(
                        activityLog.getEmployee() != null
                                && activityLog.getEmployee().getPerson() != null
                                ? Stream.of(
                                activityLog.getEmployee().getPerson().getFirstName(),
                                activityLog.getEmployee().getPerson().getMiddleName(),
                                activityLog.getEmployee().getPerson().getLastName()
                        )
                                  .filter(Objects::nonNull)
                                  .filter(s -> !s.isBlank())
                                  .collect(Collectors.joining(" "))
                                : null
                )

                .activityType(
                        activityLog.getActivityType()
                )

                .activityDescription(
                        activityLog.getActivityDescription()
                )

                .createdByPersonId(
                        activityLog.getCreatedBy() != null
                                ? activityLog.getCreatedBy().getPersonId()
                                : null
                )

                .createdBy(
                        activityLog.getCreatedBy() != null
                                && activityLog.getCreatedBy().getPerson() != null
                                ? Stream.of(
                                activityLog.getCreatedBy().getPerson().getFirstName(),
                                activityLog.getCreatedBy().getPerson().getMiddleName(),
                                activityLog.getCreatedBy().getPerson().getLastName()
                        )
                                  .filter(Objects::nonNull)
                                  .filter(s -> !s.isBlank())
                                  .collect(Collectors.joining(" "))
                                : null
                )

                .createdAt(
                        activityLog.getCreatedAt()
                )

                .build();
    }
}