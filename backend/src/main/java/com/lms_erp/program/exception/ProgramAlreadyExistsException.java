package com.lms_erp.program.exception;

public class ProgramAlreadyExistsException
        extends RuntimeException {

    public ProgramAlreadyExistsException(String message) {
        super(message);
    }
}