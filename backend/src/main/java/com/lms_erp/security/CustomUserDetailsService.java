package com.lms_erp.security;

import com.lms_erp.user.entity.User;
import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        List<UserRole> userRoles =
                userRoleRepository.findAllByUserUserId(
                        user.getUserId()
                );

        if (userRoles.isEmpty()) {
            throw new UsernameNotFoundException(
                    "No role assigned to user"
            );
        }

        List<SimpleGrantedAuthority> authorities =
                userRoles.stream()
                        .map(userRole ->
                                new SimpleGrantedAuthority(
                                        "ROLE_" + userRole.getRole().getRoleName()
                                )
                        )
                        .toList();

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}