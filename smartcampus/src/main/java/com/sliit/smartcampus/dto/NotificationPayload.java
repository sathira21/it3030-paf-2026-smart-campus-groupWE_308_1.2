package com.sliit.smartcampus.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Payload broadcasted over WebSocket to all subscribed clients on /topic/public.
 */
public class NotificationPayload {

    private String type;       // e.g. "INCIDENT_CREATED", "BOOKING_CONFIRMED", "LAB_UPDATE"
    private String title;
    private String message;
    private String timestamp;
    private String targetRole; // "ALL", "ADMIN", "USER"

    public NotificationPayload() {}

    public NotificationPayload(String type, String title, String message, String targetRole) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.targetRole = targetRole;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    // --- Getters & Setters ---
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}
