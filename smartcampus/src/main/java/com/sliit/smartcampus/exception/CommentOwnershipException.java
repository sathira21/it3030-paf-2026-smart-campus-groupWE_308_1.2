package com.sliit.smartcampus.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CommentOwnershipException extends RuntimeException {
    public CommentOwnershipException(String message) {
        super(message);
    }
}
