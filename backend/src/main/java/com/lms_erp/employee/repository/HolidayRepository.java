package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    Optional<Holiday> findByHolidayName(String holidayName);

    Optional<Holiday> findByHolidayDate(LocalDate holidayDate);

    boolean existsByHolidayName(String holidayName);

    boolean existsByHolidayDate(LocalDate holidayDate);
}