package com.lms_erp.person.exception;

public class PersonNotFoundException
        extends RuntimeException {

    public PersonNotFoundException(String message) {
        super(message);
    }
}