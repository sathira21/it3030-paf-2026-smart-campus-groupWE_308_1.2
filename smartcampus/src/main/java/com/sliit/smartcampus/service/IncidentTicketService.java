package com.sliit.smartcampus.service;

import com.sliit.smartcampus.dto.IncidentTicketRequest;
import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class IncidentTicketService {

    private final IncidentTicketRepository repository;

    @Autowired
    public IncidentTicketService(IncidentTicketRepository repository) {
        this.repository = repository;
    }

    public IncidentTicket createTicket(IncidentTicketRequest request) {
        IncidentTicket ticket = new IncidentTicket();
        ticket.setTitle(request.getTitle());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setStatus(request.getStatus());
        ticket.setCreatedBy(request.getCreatedBy());
        ticket.setRoomId(request.getRoomId());
        
        if (request.getImageAttachments() != null) {
            request.getImageAttachments().forEach(ticket::addImageAttachment);
        }

        return repository.save(ticket);
    }

    @Transactional(readOnly = true)
    public List<IncidentTicket> getAllTickets() {
        return repository.findAll();
    }
}
