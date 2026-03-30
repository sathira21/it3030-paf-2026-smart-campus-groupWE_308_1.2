package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.NotificationPayload;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Handles WebSocket STOMP messaging for real-time campus notifications.
 *
 * Two broadcast paths:
 *  1. STOMP client → /app/notify → broadcast back to /topic/public
 *  2. Internal REST trigger → POST /api/ws/broadcast → pushes to /topic/public
 */
@Controller
@RequestMapping("/api/ws")
public class WebSocketNotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * STOMP message handler.
     * Clients send a message to /app/notify and ALL subscribers on /topic/public receive it.
     */
    @MessageMapping("/notify")
    @SendTo("/topic/public")
    public NotificationPayload handleStompMessage(NotificationPayload payload) {
        System.out.println("[WS] Incoming STOMP message → broadcasting to /topic/public : " + payload.getMessage());
        return payload;
    }

    /**
     * Internal REST endpoint to programmatically push a notification to all connected clients.
     * Called by services (e.g. IncidentTicketService, BookingService) after key events.
     *
     * Example: POST /api/ws/broadcast
     * Body: { "type": "INCIDENT_CREATED", "title": "New Incident", "message": "...", "targetRole": "ALL" }
     */
    @PostMapping("/broadcast")
    @ResponseBody
    public NotificationPayload broadcastNotification(@RequestBody NotificationPayload payload) {
        messagingTemplate.convertAndSend("/topic/public", payload);
        System.out.println("[WS] REST-triggered broadcast → /topic/public : " + payload.getMessage());
        return payload;
    }
}
