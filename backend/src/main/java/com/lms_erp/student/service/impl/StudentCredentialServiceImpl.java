package com.lms_erp.student.service.impl;

import com.lms_erp.student.dto.StudentCredentialResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.service.StudentCredentialService;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentCredentialServiceImpl
        implements StudentCredentialService {

    private final UserRepository userRepository;
    private final StudentApplicationRepository studentApplicationRepository;

    @Override
    public List<StudentCredentialResponse> getAllCredentials() {

        List<StudentCredentialResponse> result = new ArrayList<>();

        List<User> users = userRepository.findAll();

        for (User user : users) {

            if (user.getPerson() == null) {
                continue;
            }

            StudentApplication application =
                    studentApplicationRepository
                            .findByPersonPersonId(
                                    user.getPerson().getPersonId()
                            )
                            .orElse(null);

            if (application == null) {
                continue;
            }

            String firstName = user.getPerson().getFirstName() == null
                    ? ""
                    : user.getPerson().getFirstName();

            String lastName = user.getPerson().getLastName() == null
                    ? ""
                    : user.getPerson().getLastName();

            String fullName = (firstName + " " + lastName).trim();

            String password = user.getPassword();

            // Skip encrypted passwords
            if (password != null && password.startsWith("$2")) {
                continue;
            }

            result.add(
                    new StudentCredentialResponse(
                            application.getPersonId(),
                            fullName,
                            user.getUsername(),
                            password
                    )
            );
        }

        return result;
    }
}