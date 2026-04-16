package com.sliit.smartcampus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auth_logs")
public class AuthLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String email;

    @Enumerated(EnumType.STRING)
    private AuthLogStatus status;

    private String ipAddress;

    private LocalDateTime timestamp;

    public AuthLog() {}

    public AuthLog(String email, AuthLogStatus status, String ipAddress, LocalDateTime timestamp) {
        this.email = email;
        this.status = status;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public AuthLogStatus getStatus() {
        return status;
    }

    public void setStatus(AuthLogStatus status) {
        this.status = status;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
