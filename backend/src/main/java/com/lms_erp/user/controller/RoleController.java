package com.lms_erp.user.controller;

import com.lms_erp.user.entity.Role;
import com.lms_erp.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor

public class RoleController {

    private final RoleRepository roleRepository;

    @GetMapping
    public List<Role> getAllRoles() {

        return roleRepository.findAll();
    }

    @GetMapping("/{roleId}")
    public Role getRoleById(
            @PathVariable Long roleId
    ) {

        return roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Role not found"
                        )
                );
    }


}