package com.sliit.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketCommentRequest {

    @NotBlank(message = "Comment text is mandatory")
    private String commentText;

    @NotBlank(message = "Author is mandatory")
    private String author;

    public TicketCommentRequest() {}

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
