package com.lms_erp.student.repository;

import com.lms_erp.person.entity.Person;
import com.lms_erp.student.entity.ApplicationStageMaster;
import com.lms_erp.student.entity.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentApplicationRepository
        extends JpaRepository<StudentApplication, Long> {

    Optional<StudentApplication> findByPerson(Person person);

    Optional<StudentApplication> findByPersonPersonId(Long personId);

    List<StudentApplication> findByApplicationStage(
            ApplicationStageMaster applicationStage
    );

    List<StudentApplication> findByCounselorPersonId(Long counselorPersonId);
    List<StudentApplication> findByApplicationStageApplicationStageName(
            String applicationStageName
    );

}