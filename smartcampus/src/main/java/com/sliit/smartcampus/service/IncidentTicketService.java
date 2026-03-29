package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.IncidentTicket;
import com.sliit.smartcampus.repository.IncidentTicketRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public IncidentTicketService(IncidentTicketRepository incidentTicketRepository, 
                                 NotificationService notificationService,
                                 UserRepository userRepository) {
        this.incidentTicketRepository = incidentTicketRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus("OPEN");
        }
        return incidentTicketRepository.save(ticket);
    }

    public List<IncidentTicket> getAllTickets() {
        return incidentTicketRepository.findAll();
    }

    public List<IncidentTicket> getTicketsByCreator(String email) {
        // Simple search by creator email
        return incidentTicketRepository.findAll().stream()
                .filter(t -> t.getCreatedBy() != null && t.getCreatedBy().equalsIgnoreCase(email))
                .toList();
    }

    public IncidentTicket updateStatus(Long id, String newStatus) {
        Optional<IncidentTicket> ticketOpt = incidentTicketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            String oldStatus = ticket.getStatus();
            ticket.setStatus(newStatus);
            IncidentTicket updatedTicket = incidentTicketRepository.save(ticket);

            // COOL STUFF: Automatically notify the student of the status change!
            if (!newStatus.equalsIgnoreCase(oldStatus)) {
                notifyUserOfStatusChange(updatedTicket);
            }
            
            return updatedTicket;
        }
        throw new RuntimeException("Ticket not found with id: " + id);
    }

    private void notifyUserOfStatusChange(IncidentTicket ticket) {
        Optional<User> userOpt = userRepository.findByEmail(ticket.getCreatedBy());
        if (userOpt.isPresent()) {
            String message = "Your ticket #" + ticket.getId() + " (" + ticket.getTitle() + 
                             ") has been updated to: " + ticket.getStatus();
            notificationService.createNotification(userOpt.get().getId(), message);
        }
    }
}
