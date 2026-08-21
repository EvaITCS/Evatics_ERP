package com.lms_erp.program.validation;

import com.lms_erp.program.dto.ProgramCreateRequest;

public final class ProgramValidation {

    private ProgramValidation() {
    }

    public static void validateProgram(
            ProgramCreateRequest request
    ) {

        if (request.getProgramName() == null
                || request.getProgramName().isBlank()) {

            throw new IllegalArgumentException(
                    "Program name is required"
            );
        }

        if (request.getDurationValue() == null
                || request.getDurationValue() <= 0) {

            throw new IllegalArgumentException(
                    "Duration value is required"
            );
        }

        if (request.getDurationType() == null
                || request.getDurationType().isBlank()) {

            throw new IllegalArgumentException(
                    "Duration type is required"
            );
        }
    }
}