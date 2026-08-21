package com.lms_erp.program.exception;

public class ProgramNotFoundException
        extends RuntimeException {

    public ProgramNotFoundException(String message) {
        super(message);
    }
}