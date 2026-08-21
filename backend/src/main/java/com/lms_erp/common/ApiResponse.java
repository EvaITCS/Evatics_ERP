package com.lms_erp.common;

import lombok.*;

@Data
public class ApiResponse<T> {

    private boolean success;

    private String message;

    private T data;
}