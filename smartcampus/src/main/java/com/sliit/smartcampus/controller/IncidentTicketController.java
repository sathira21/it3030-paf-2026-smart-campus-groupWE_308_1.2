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

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> createTicket(@RequestBody IncidentTicket ticket, Authentication authentication) {
        // Set creator to current logged-in user email
        ticket.setCreatedBy(authentication.getName());
        return ResponseEntity.ok(incidentTicketService.createTicket(ticket));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(incidentTicketService.getTicketsByCreator(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(incidentTicketService.getAllTickets());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IncidentTicket> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        return ResponseEntity.ok(incidentTicketService.updateStatus(id, newStatus));
    }
}
