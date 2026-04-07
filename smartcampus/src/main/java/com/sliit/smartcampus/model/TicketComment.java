package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_comments")
public class TicketComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String commentText;

    private String author;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private IncidentTicket incidentTicket;

    public TicketComment() {}

    public TicketComment(String commentText, String author, IncidentTicket incidentTicket) {
        this.commentText = commentText;
        this.author = author;
        this.incidentTicket = incidentTicket;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public IncidentTicket getIncidentTicket() {
        return incidentTicket;
    }

    public void setIncidentTicket(IncidentTicket incidentTicket) {
        this.incidentTicket = incidentTicket;
    }
}
