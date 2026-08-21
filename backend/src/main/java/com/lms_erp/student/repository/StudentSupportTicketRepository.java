package com.lms_erp.student.repository;

import com.lms_erp.student.entity.StudentSupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentSupportTicketRepository
        extends JpaRepository<StudentSupportTicket, Long> {

    List<StudentSupportTicket> findByStatusOrderByCreatedAtDesc(String status);

}