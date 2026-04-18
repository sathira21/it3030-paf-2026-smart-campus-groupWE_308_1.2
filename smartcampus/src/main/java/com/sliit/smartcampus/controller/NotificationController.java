package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Notification;
import com.sliit.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") // Added for standard development access
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            Notification updatedNotification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(updatedNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
