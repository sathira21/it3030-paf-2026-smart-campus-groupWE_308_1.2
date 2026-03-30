package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, 
                          NotificationService notificationService,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null) {
            booking.setStatus("PENDING");
        }
        Booking savedBooking = bookingRepository.save(booking);
        
        // Notify the user that their booking request was received
        sendBookingNotification(savedBooking, "Your booking request for " + savedBooking.getResourceName() + " has been received! 📅");
        
        return savedBooking;
    }

    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmail(email);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    private void sendBookingNotification(Booking booking, String message) {
        Optional<User> userOpt = userRepository.findByEmail(booking.getUserEmail());
        if (userOpt.isPresent()) {
            notificationService.createNotification(userOpt.get().getId(), message);
        }
    }
}
