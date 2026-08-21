package com.lms_erp.person.exception;

public class PersonAlreadyExistsException
        extends RuntimeException {

    public PersonAlreadyExistsException(String message) {
        super(message);
    }
}