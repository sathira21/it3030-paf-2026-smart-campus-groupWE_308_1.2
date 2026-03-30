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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class IncidentTicketController {

    private final IncidentTicketService service;

    @Autowired
    public IncidentTicketController(IncidentTicketService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<IncidentTicket> createTicket(@Valid @RequestBody IncidentTicketRequest request) {
        IncidentTicket createdTicket = service.createTicket(request);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        List<IncidentTicket> tickets = service.getAllTickets();
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentTicket> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request) {
        IncidentTicket updatedTicket = service.updateTicketStatus(id, request.getStatus());
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentTicket> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody TechnicianAssignmentRequest request) {
        IncidentTicket updatedTicket = service.assignTechnician(id, request.getAssignedTechnician(), request.getResolutionNotes());
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(@PathVariable Long id, 
                                                    @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = service.addComment(id, request.getAuthor(), request.getCommentText());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, 
                                              @PathVariable Long commentId,
                                              @RequestParam String author) {
        service.deleteComment(id, commentId, author);
        return ResponseEntity.noContent().build();
    }
}
