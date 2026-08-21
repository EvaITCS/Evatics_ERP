package com.lms_erp.user.repository;

import com.lms_erp.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByPersonPersonId(Long personId);

    List<User> findAll();

    List<User> findByIsLockedTrue();

    @Query("""
        SELECT u
        FROM User u
        JOIN UserRole ur
            ON ur.user.userId = u.userId
        WHERE u.isActive = true
          AND ur.role.roleName = 'COUNSELLOR'
        """)
    List<User> findActiveCounsellors();

    @Query("""
        SELECT u
        FROM User u
        JOIN UserRole ur
            ON ur.user.userId = u.userId
        WHERE ur.role.roleName = 'COUNSELLOR'
          AND u.isActive = true
        ORDER BY u.person.firstName
        """)
    List<User> findAllCounsellors();

    @Query("""
        SELECT u
        FROM User u
        LEFT JOIN FETCH u.person
        """)
    List<User> findAllWithPerson();
}