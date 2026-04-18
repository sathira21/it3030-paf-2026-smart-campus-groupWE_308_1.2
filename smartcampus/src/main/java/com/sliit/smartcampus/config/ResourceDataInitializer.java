package com.sliit.smartcampus.config;

import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class ResourceDataInitializer {

    @Bean
    CommandLineRunner initResources(ResourceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // 1. Lecture Halls
                Resource hallA = new Resource();
                hallA.setName("Grand Auditorium (Hall A)");
                hallA.setType("LECTURE_HALL");
                hallA.setCapacity(500);
                hallA.setLocation("Main Building, Level 1");
                hallA.setDescription("State-of-the-art auditorium with 4K projection and surround sound.");
                hallA.setAmenities(Arrays.asList("Air Conditioning", "Projector", "Sound System", "Stage Lighting"));
                hallA.setFeatures(Arrays.asList("High-Speed WiFi", "Charging Ports", "Wheelchair Access"));
                hallA.setPricePerHour(150.0);
                hallA.setRating(4.8);
                hallA.setReviewCount(124);
                hallA.setIsPopular(true);
                hallA.setStatus("ACTIVE");

                Resource hallB = new Resource();
                hallB.setName("Lecture Hall 12B");
                hallB.setType("LECTURE_HALL");
                hallB.setCapacity(120);
                hallB.setLocation("Computing Science Block, Level 2");
                hallB.setDescription("Medium capacity hall optimized for interactive lectures.");
                hallB.setAmenities(Arrays.asList("Air Conditioning", "Smart Board", "Desktop PC"));
                hallB.setFeatures(Arrays.asList("Recording Equipment", "Microphones"));
                hallB.setPricePerHour(75.0);
                hallB.setRating(4.5);
                hallB.setReviewCount(86);
                hallB.setStatus("ACTIVE");

                // 2. Meeting Rooms
                Resource room1 = new Resource();
                room1.setName("Executive Boardroom");
                room1.setType("MEETING_ROOM");
                room1.setCapacity(15);
                room1.setLocation("Admin Wing, Level 3");
                room1.setDescription("Premium boardroom with dynamic display and video conferencing.");
                room1.setAmenities(Arrays.asList("Conference Camera", "85\" LED Screen", "Whiteboard", "Coffee Station"));
                room1.setFeatures(Arrays.asList("Privacy Glass", "Soundproofing"));
                room1.setPricePerHour(50.0);
                room1.setRating(4.9);
                room1.setReviewCount(45);
                room1.setIsPopular(true);
                room1.setStatus("ACTIVE");

                Resource hub1 = new Resource();
                hub1.setName("Collaborative Startup Hub");
                hub1.setType("MEETING_ROOM");
                hub1.setCapacity(25);
                hub1.setLocation("Innovation Center, Ground Floor");
                hub1.setDescription("Open-plan collaborative space for group brainstorming.");
                hub1.setAmenities(Arrays.asList("Moveable Furniture", "Multiple Display Screens", "Wall-to-Wall Whiteboards"));
                hub1.setPricePerHour(40.0);
                hub1.setRating(4.7);
                hub1.setReviewCount(92);
                hub1.setStatus("ACTIVE");

                // 3. Laboratories
                Resource lab1 = new Resource();
                lab1.setName("IoT Innovation Lab");
                lab1.setType("LAB");
                lab1.setCapacity(40);
                lab1.setLocation("FOSS Wing, Level 4");
                lab1.setDescription("Specialized lab for IoT and embedded systems research.");
                lab1.setAmenities(Arrays.asList("Soldering Stations", "Oscilloscopes", "3D Printers"));
                lab1.setFeatures(Arrays.asList("High-Power Desktops", "Specialized Network Segment"));
                lab1.setPricePerHour(100.0);
                lab1.setRating(4.6);
                lab1.setReviewCount(30);
                lab1.setStatus("ACTIVE");

                // 4. Equipment
                Resource eq1 = new Resource();
                eq1.setName("Hololens 2 Mixed Reality Kit");
                eq1.setType("EQUIPMENT");
                eq1.setCapacity(1); // Individual item
                eq1.setLocation("Media Resource Center, Level 2");
                eq1.setDescription("Microsoft Hololens 2 headset for MR/AR development projects.");
                eq1.setAmenities(Arrays.asList("Charging Dock", "Hard Shell Case"));
                eq1.setFeatures(Arrays.asList("Includes SDK Access", "Insurance Covered"));
                eq1.setPricePerHour(20.0);
                eq1.setRating(5.0);
                eq1.setReviewCount(12);
                eq1.setStatus("ACTIVE");

                repository.saveAll(Arrays.asList(hallA, hallB, room1, hub1, lab1, eq1));
                System.out.println(">> [Data] Smart Campus Resource Directory Initialized.");
            }
        };
    }
}
