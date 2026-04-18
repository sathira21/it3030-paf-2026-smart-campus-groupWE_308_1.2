package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
import com.sliit.smartcampus.dto.TicketCommentRequest;
import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.model.TicketComment;
import com.sliit.smartcampus.service.IncidentTicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

    private final IncidentTicketService service;

    @Autowired
    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    // ── Create ──────────────────────────────────────────────────────────────

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicketRequest request,
            Authentication authentication) {
        request.setCreatedBy(authentication.getName());
        return ResponseEntity.ok(service.createTicket(request));
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(service.getTicketsByCreator(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getAllTickets(
            @RequestParam(defaultValue = "ALL") String status) {
        return ResponseEntity.ok(service.getAllTicketsByStatus(status));
    }

    @GetMapping("/{id:\\d+}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        return service.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateStatus(@PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        return ResponseEntity.ok(service.updateStatus(id, newStatus));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateAssignment(@PathVariable Long id,
            @RequestBody Map<String, String> assignMap) {
        String assignedTo = assignMap.get("assignedTo");
        return ResponseEntity.ok(service.updateAssignment(id, assignedTo));
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = service.addComment(id, request.getAuthor(), request.getCommentText());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id,
            @PathVariable Long commentId,
            @RequestParam String author) {
        service.deleteComment(id, commentId, author);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/evidence")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> uploadEvidence(@PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) {
        IncidentTicket updatedTicket = service.uploadEvidence(id, files);
        return ResponseEntity.ok(updatedTicket);
    }
}
