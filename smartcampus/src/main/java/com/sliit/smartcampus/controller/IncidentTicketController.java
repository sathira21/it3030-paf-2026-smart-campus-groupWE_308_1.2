package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.service.IncidentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<IncidentTicket> createTicket(@RequestBody IncidentTicket ticket,
                                                       Authentication authentication) {
        ticket.setCreatedBy(authentication.getName());
        return ResponseEntity.ok(incidentTicketService.createTicket(ticket));
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
                                                       @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        return ResponseEntity.ok(incidentTicketService.updateStatus(id, newStatus));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateAssignment(@PathVariable Long id,
                                                           @RequestBody Map<String, String> assignMap) {
        String assignedTo = assignMap.get("assignedTo");
        return ResponseEntity.ok(incidentTicketService.updateAssignment(id, assignedTo));
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        incidentTicketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
