package com.lms_erp.student.repository;

import com.lms_erp.student.entity.ProfileChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileChangeRequestRepository
        extends JpaRepository<ProfileChangeRequest, Long> {

    List<ProfileChangeRequest> findByCandidatePersonIdAndStatus(
            Long candidatePersonId,
            String status
    );

    List<ProfileChangeRequest> findByStatus(String status);
}