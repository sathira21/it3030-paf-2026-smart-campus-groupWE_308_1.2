package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
import com.sliit.smartcampus.model.IncidentTicket;
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
}
