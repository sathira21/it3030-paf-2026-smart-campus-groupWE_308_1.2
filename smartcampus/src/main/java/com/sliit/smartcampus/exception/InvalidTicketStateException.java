package com.sliit.smartcampus.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTicketStateException extends RuntimeException {
    public InvalidTicketStateException(String message) {
        super(message);
    }
}
