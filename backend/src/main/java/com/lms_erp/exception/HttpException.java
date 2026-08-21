package com.lms_erp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.ErrorResponseException;

public class HttpException extends ErrorResponseException {

    public HttpException(HttpStatus httpStatus, String message) {
        super(httpStatus);
        this.setDetail(message);
    }


    public HttpException(HttpStatus httpStatus, String message, Throwable cause) {
        super(httpStatus, cause);
        this.setDetail(message);
    }

    /* 5xx error codes*/
    public static HttpException of(String message) {
        return new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }

    /* 4xx Error Codes */
    public static HttpException notFound(String message) {
        return new HttpException(HttpStatus.NOT_FOUND, message);
    }

    public static HttpException badRequest(String message) {
        return new HttpException(HttpStatus.BAD_REQUEST, message);
    }

    public static HttpException conflict(String message) {
        return new HttpException(HttpStatus.CONFLICT, message);
    }

    /* Security Error Codes */
    public static HttpException unauthorized(String message) {
        return new HttpException(HttpStatus.UNAUTHORIZED, message);
    }

    public static HttpException forbidden(String message) {
        return new HttpException(HttpStatus.FORBIDDEN, message);
    }
}
