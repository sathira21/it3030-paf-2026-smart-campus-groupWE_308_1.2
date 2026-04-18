package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
<<<<<<< HEAD
import com.sliit.smartcampus.dto.TicketStatusUpdateRequest;
import com.sliit.smartcampus.dto.TechnicianAssignmentRequest;
=======
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
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
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;
=======
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

<<<<<<< HEAD
    private final IncidentTicketService incidentTicketService;

    @Autowired
    public IncidentTicketController(IncidentTicketService incidentTicketService) {
        this.incidentTicketService = incidentTicketService;
=======
    private final IncidentTicketService service;

    @Autowired
    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    // ── Create ──────────────────────────────────────────────────────────────

    @PostMapping("/create")
<<<<<<< HEAD
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicketRequest request,
                                                       Authentication authentication) {
        request.setCreatedBy(authentication.getName());
        IncidentTicket createdTicket = incidentTicketService.createTicketFromRequest(request);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
=======
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicketRequest request,
            Authentication authentication) {
        request.setCreatedBy(authentication.getName());
        return ResponseEntity.ok(service.createTicket(request));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    @GetMapping("/my")
<<<<<<< HEAD
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(incidentTicketService.getTicketsByCreator(authentication.getName()));
=======
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(service.getTicketsByCreator(authentication.getName()));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getAllTickets(
            @RequestParam(defaultValue = "ALL") String status) {
<<<<<<< HEAD
        return ResponseEntity.ok(incidentTicketService.getAllTicketsByStatus(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        return incidentTicketService.getTicketById(id)
=======
        return ResponseEntity.ok(service.getAllTicketsByStatus(status));
    }

    @GetMapping("/{id:\\d+}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        return service.getTicketById(id)
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
<<<<<<< HEAD
        return ResponseEntity.ok(incidentTicketService.getStats());
=======
        return ResponseEntity.ok(service.getStats());
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateStatus(@PathVariable Long id,
<<<<<<< HEAD
                                                       @Valid @RequestBody TicketStatusUpdateRequest request) {
        return ResponseEntity.ok(incidentTicketService.updateStatus(id, request.getStatus().name()));
=======
            @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        return ResponseEntity.ok(service.updateStatus(id, newStatus));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateAssignment(@PathVariable Long id,
<<<<<<< HEAD
                                                           @Valid @RequestBody TechnicianAssignmentRequest request) {
        return ResponseEntity.ok(incidentTicketService.updateAssignment(id, request.getAssignedTechnician(), request.getResolutionNotes()));
=======
            @RequestBody Map<String, String> assignMap) {
        String assignedTo = assignMap.get("assignedTo");
        return ResponseEntity.ok(service.updateAssignment(id, assignedTo));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
<<<<<<< HEAD
        incidentTicketService.deleteTicket(id);
=======
        service.deleteTicket(id);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
<<<<<<< HEAD
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id, 
                                                    @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = incidentTicketService.addComment(id, request.getAuthor(), request.getCommentText());
=======
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = service.addComment(id, request.getAuthor(), request.getCommentText());
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/comments/{commentId}")
<<<<<<< HEAD
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, 
                                              @PathVariable Long commentId,
                                              @RequestParam String author) {
        incidentTicketService.deleteComment(id, commentId, author);
=======
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id,
            @PathVariable Long commentId,
            @RequestParam String author) {
        service.deleteComment(id, commentId, author);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/evidence")
<<<<<<< HEAD
    public ResponseEntity<IncidentTicket> uploadEvidence(@PathVariable Long id, 
                                                         @RequestParam("files") MultipartFile[] files) {
        IncidentTicket updatedTicket = incidentTicketService.uploadEvidence(id, files);
=======
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> uploadEvidence(@PathVariable Long id,
            @RequestParam("files") MultipartFile[] files) {
        IncidentTicket updatedTicket = service.uploadEvidence(id, files);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        return ResponseEntity.ok(updatedTicket);
    }
}
