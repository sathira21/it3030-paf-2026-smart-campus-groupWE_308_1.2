package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
import com.sliit.smartcampus.dto.TicketStatusUpdateRequest;
import com.sliit.smartcampus.dto.TechnicianAssignmentRequest;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

    private final IncidentTicketService incidentTicketService;

    @Autowired
    public IncidentTicketController(IncidentTicketService incidentTicketService) {
        this.incidentTicketService = incidentTicketService;
    }

    // ── Create ──────────────────────────────────────────────────────────────

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicketRequest request,
                                                       Authentication authentication) {
        request.setCreatedBy(authentication.getName());
        IncidentTicket createdTicket = incidentTicketService.createTicketFromRequest(request);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(incidentTicketService.getTicketsByCreator(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getAllTickets(
            @RequestParam(defaultValue = "ALL") String status) {
        return ResponseEntity.ok(incidentTicketService.getAllTicketsByStatus(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        return incidentTicketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(incidentTicketService.getStats());
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody TicketStatusUpdateRequest request) {
        return ResponseEntity.ok(incidentTicketService.updateStatus(id, request.getStatus().name()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateAssignment(@PathVariable Long id,
                                                           @Valid @RequestBody TechnicianAssignmentRequest request) {
        return ResponseEntity.ok(incidentTicketService.updateAssignment(id, request.getAssignedTechnician(), request.getResolutionNotes()));
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        incidentTicketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id, 
                                                    @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = incidentTicketService.addComment(id, request.getAuthor(), request.getCommentText());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, 
                                              @PathVariable Long commentId,
                                              @RequestParam String author) {
        incidentTicketService.deleteComment(id, commentId, author);
        return ResponseEntity.noContent().build();
    }
}
