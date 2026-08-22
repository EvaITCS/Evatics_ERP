package com.lms_erp.user.repository;

import com.lms_erp.user.entity.Role;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    // =====================================================
    // GET ALL ROLES OF A USER
    // =====================================================
    List<UserRole> findAllByUserUserId(Long userId);
    List<UserRole> findByUser_UserId(Long userId);
    boolean existsByUserAndRole(User user, Role role);
    // =====================================================
    // GET ALL USERS HAVING A ROLE
    // =====================================================

    List<UserRole> findByRole_RoleName(String roleName);
void deleteByUserUserId(Long userId);
    Optional<UserRole> findByUser(User user);

}
