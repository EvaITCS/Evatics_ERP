package com.lms_erp.student.service;

import com.lms_erp.student.dto.StudentCredentialResponse;

import java.util.List;

public interface StudentCredentialService {

    List<StudentCredentialResponse> getAllCredentials();
}