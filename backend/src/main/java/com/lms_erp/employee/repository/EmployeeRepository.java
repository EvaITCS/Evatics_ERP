package com.lms_erp.employee.repository;

import com.lms_erp.employee.dto.CounsellorDropdownResponse;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.trainer.dto.TrainerDropdownResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // =====================================================
    // FIND EMPLOYEE BY PERSON ID
    // =====================================================

    Optional<Employee> findByPersonPersonId(Long personId);
Optional<Employee> findByPersonId(Long personId);
    // =====================================================
    // DASHBOARD
    // =====================================================

    long countByEmployeeStatus_StatusName(String statusName);

    boolean existsByEmployeeCode(String employeeCode);

    // =====================================================
    // FETCH EMPLOYEE WITH DETAILS
    // =====================================================

    @Query("""
            SELECT e
            FROM Employee e
            LEFT JOIN FETCH e.person
            LEFT JOIN FETCH e.department
            LEFT JOIN FETCH e.designation
            LEFT JOIN FETCH e.employeeStatus
            LEFT JOIN FETCH e.workMode
            LEFT JOIN FETCH e.shift
            LEFT JOIN FETCH e.location
            WHERE e.personId = :personId
            """)
    Optional<Employee> findByIdWithDetails(
            @Param("personId") Long personId
    );

    // =====================================================
    // FETCH ALL EMPLOYEES
    // =====================================================

    @Query("""
            SELECT DISTINCT e
            FROM Employee e
            LEFT JOIN FETCH e.person
            LEFT JOIN FETCH e.department
            LEFT JOIN FETCH e.designation
            LEFT JOIN FETCH e.employeeStatus
            LEFT JOIN FETCH e.workMode
            LEFT JOIN FETCH e.shift
            LEFT JOIN FETCH e.location
            ORDER BY e.personId
            """)
    List<Employee> findAllWithDetails();

    // =====================================================
    // FIND EMPLOYEE BY USER
    // =====================================================
//
//    @Query("""
//            SELECT e
//            FROM Employee e
//            JOIN e.person p
//            JOIN User u
//                ON u.person = p
//            WHERE u.userId = :userId
//            """)
//    Optional<Employee> findByUserId(
//            @Param("userId") Long userId
//    );

    // =====================================================
    // LAST EMPLOYEE CODE
    // =====================================================

    @Query(value = """
            SELECT employee_code
            FROM employees
            WHERE employee_code LIKE CONCAT(:prefix,'%')
            ORDER BY employee_code DESC
            LIMIT 1
            """, nativeQuery = true)
    String findLastEmployeeCodeByPrefix(
            @Param("prefix") String prefix
    );

    // =====================================================
    // TRAINER DROPDOWN
    // =====================================================

    @Query("""
            SELECT new com.lms_erp.trainer.dto.TrainerDropdownResponse(

                e.personId,

                concat(
                    coalesce(p.firstName,''),
                    ' ',
                    coalesce(p.middleName,''),
                    ' ',
                    coalesce(p.lastName,'')
                )

            )

            FROM Employee e

            JOIN e.person p
            JOIN e.designation d
            JOIN d.role r

            WHERE r.roleName='TRAINER'

            ORDER BY p.firstName
            """)
    List<TrainerDropdownResponse> getTrainerDropdown();

    // =====================================================
    // FETCH ALL TRAINERS
    // =====================================================

    @Query("""
            SELECT e
            FROM Employee e
            JOIN FETCH e.person p
            JOIN FETCH e.designation d
            JOIN FETCH d.role r
            WHERE r.roleName='TRAINER'
            ORDER BY p.firstName
            """)
    List<Employee> findAllTrainers();

    // =====================================================
    // COUNSELLOR DROPDOWN
    // =====================================================

    @Query("""
            SELECT new com.lms_erp.employee.dto.CounsellorDropdownResponse(

                e.personId,

                concat(
                    coalesce(p.firstName,''),
                    ' ',
                    coalesce(p.middleName,''),
                    ' ',
                    coalesce(p.lastName,'')
                )

            )

            FROM Employee e

            JOIN e.person p
            JOIN e.designation d
            JOIN d.role r

            WHERE r.roleName='COUNSELLOR'

            ORDER BY p.firstName
            """)
    List<CounsellorDropdownResponse> getCounsellorDropdown();

    // =====================================================
    // FETCH ALL COUNSELLORS
    // =====================================================

    @Query("""
            SELECT e
            FROM Employee e
            JOIN FETCH e.person p
            JOIN FETCH e.designation d
            JOIN FETCH d.role r
            WHERE r.roleName='COUNSELLOR'
            ORDER BY p.firstName
            """)
    List<Employee> findAllCounsellors();
// =====================================================
// AVAILABLE TRAINERS FOR EDIT
// =====================================================

    @Query("""
    SELECT new com.lms_erp.trainer.dto.TrainerDropdownResponse(

        e.personId,

        concat(
            coalesce(p.firstName,''),
            ' ',
            coalesce(p.middleName,''),
            ' ',
            coalesce(p.lastName,'')
        )

    )

    FROM Employee e

    JOIN e.person p
    JOIN e.designation d
    JOIN d.role r

    WHERE r.roleName = 'TRAINER'

    ORDER BY p.firstName
    """)
    List<TrainerDropdownResponse> getAvailableTrainerDropdownForEdit(
            @Param("batchId") Long batchId
    );


    // =====================================================
// AVAILABLE TRAINERS
// =====================================================

    @Query("""
    SELECT new com.lms_erp.trainer.dto.TrainerDropdownResponse(

        e.personId,

        concat(
            coalesce(p.firstName,''),
            ' ',
            coalesce(p.middleName,''),
            ' ',
            coalesce(p.lastName,'')
        )

    )

    FROM Employee e

    JOIN e.person p
    JOIN e.designation d
    JOIN d.role r

    WHERE r.roleName = 'TRAINER'

    ORDER BY p.firstName
    """)
    List<TrainerDropdownResponse> getAvailableTrainerDropdown();

    // =====================================================
// FETCH ALL ADMINS
// =====================================================

    @Query("""
    SELECT e
    FROM Employee e
    JOIN FETCH e.person p
    JOIN FETCH e.designation d
    JOIN FETCH d.role r
    WHERE r.roleName = 'ADMIN'
    ORDER BY p.firstName
    """)
    List<Employee> findAllAdmins();


    // =====================================================
// FIND EMPLOYEE BY USER ID WITH PERSON
// =====================================================

    @Query("""
        SELECT e
        FROM Employee e
        JOIN FETCH e.person p
        JOIN User u
            ON u.person = p
        WHERE u.userId = :userId
        """)
    Optional<Employee> findByUserId(
            @Param("userId") Long userId
    );
}