package com.lms_erp.trainer.repository;

import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.trainer.entity.StudentDropRequest;
import com.lms_erp.trainer.entity.StudentDropStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentDropRequestRepository
        extends JpaRepository<StudentDropRequest, Long> {

    // =========================================================
    // TRAINER REQUESTS
    // =========================================================

    @Query("""
        SELECT dr
        FROM StudentDropRequest dr
        JOIN FETCH dr.studentBatch sb
        JOIN FETCH sb.studentApplication sa
        JOIN FETCH sa.person sp
        JOIN FETCH sb.batch b
        JOIN FETCH dr.requestedBy rb
        JOIN FETCH rb.person rbp
        LEFT JOIN FETCH dr.assignedTo at
        LEFT JOIN FETCH at.person ap
        LEFT JOIN FETCH dr.reviewedBy rv
        LEFT JOIN FETCH rv.person rvp
        JOIN FETCH dr.dropStatus ds
        WHERE rb.personId = :trainerPersonId
        ORDER BY dr.requestedAt DESC
        """)
    List<StudentDropRequest> findByRequestedByWithDetails(
            @Param("trainerPersonId") Long trainerPersonId
    );


    // =========================================================
    // COUNSELLOR REQUESTS
    // =========================================================

    @Query("""
        SELECT dr
        FROM StudentDropRequest dr
        JOIN FETCH dr.studentBatch sb
        JOIN FETCH sb.studentApplication sa
        JOIN FETCH sa.person sp
        JOIN FETCH sb.batch b
        JOIN FETCH dr.requestedBy rb
        JOIN FETCH rb.person rbp
        LEFT JOIN FETCH dr.assignedTo at
        LEFT JOIN FETCH at.person ap
        LEFT JOIN FETCH dr.reviewedBy rv
        LEFT JOIN FETCH rv.person rvp
        JOIN FETCH dr.dropStatus ds
        WHERE at.personId = :counselorPersonId
        ORDER BY dr.requestedAt DESC
        """)
    List<StudentDropRequest> findByAssignedToWithDetails(
            @Param("counselorPersonId") Long counselorPersonId
    );


    // =========================================================
    // REQUESTS BY STATUS
    // =========================================================

    @Query("""
        SELECT dr
        FROM StudentDropRequest dr
        JOIN FETCH dr.studentBatch sb
        JOIN FETCH sb.studentApplication sa
        JOIN FETCH sa.person sp
        JOIN FETCH sb.batch b
        JOIN FETCH dr.requestedBy rb
        JOIN FETCH rb.person rbp
        LEFT JOIN FETCH dr.assignedTo at
        LEFT JOIN FETCH at.person ap
        LEFT JOIN FETCH dr.reviewedBy rv
        LEFT JOIN FETCH rv.person rvp
        JOIN FETCH dr.dropStatus ds
        WHERE ds = :status
        ORDER BY dr.requestedAt DESC
        """)
    List<StudentDropRequest> findByDropStatusWithDetails(
            @Param("status") StudentDropStatus status
    );


    // =========================================================
    // FIND BY STUDENT BATCH
    // =========================================================

    Optional<StudentDropRequest> findByStudentBatch(
            StudentBatch studentBatch
    );


    // =========================================================
    // FIND BY COUNSELLOR + STATUS
    // =========================================================

    List<StudentDropRequest> findByAssignedToAndDropStatus(
            com.lms_erp.employee.entity.Employee assignedTo,
            StudentDropStatus status
    );


    // =========================================================
    // FIND BY TRAINER + STATUS
    // =========================================================

    List<StudentDropRequest> findByRequestedByAndDropStatus(
            com.lms_erp.employee.entity.Employee requestedBy,
            StudentDropStatus status
    );


    // =========================================================
    // SINGLE REQUEST WITH DETAILS
    // =========================================================

    @Query("""
        SELECT dr
        FROM StudentDropRequest dr
        JOIN FETCH dr.studentBatch sb
        JOIN FETCH sb.studentApplication sa
        JOIN FETCH sa.person sp
        JOIN FETCH sb.batch b
        JOIN FETCH dr.requestedBy rb
        JOIN FETCH rb.person rbp
        LEFT JOIN FETCH dr.assignedTo at
        LEFT JOIN FETCH at.person ap
        LEFT JOIN FETCH dr.reviewedBy rv
        LEFT JOIN FETCH rv.person rvp
        JOIN FETCH dr.dropStatus ds
        WHERE dr.dropRequestId = :dropRequestId
        """)
    Optional<StudentDropRequest> findByIdWithDetails(
            @Param("dropRequestId") Long dropRequestId
    );


    // =========================================================
    // ACTIVE REQUEST
    // =========================================================

    @Query("""
        SELECT dr
        FROM StudentDropRequest dr
        WHERE dr.studentBatch = :studentBatch
        AND dr.dropStatus.statusName IN (
            'PENDING',
            'CONSULTANT_ASSIGNED',
            'CONSULTANT_COMPLETED'
        )
        """)
    Optional<StudentDropRequest> findActiveRequest(
            @Param("studentBatch") StudentBatch studentBatch
    );
}