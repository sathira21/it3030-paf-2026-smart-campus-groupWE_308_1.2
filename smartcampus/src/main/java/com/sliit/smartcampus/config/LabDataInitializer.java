package com.sliit.smartcampus.config;

import com.sliit.smartcampus.model.CourseLab;
import com.sliit.smartcampus.repository.CourseLabRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class LabDataInitializer {

    @Bean
    CommandLineRunner initLabs(CourseLabRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                CourseLab lab1 = new CourseLab();
                lab1.setLabName("Main Computing Center (MCC)");
                lab1.setLocation("FOSS Wing, Level 3");
                lab1.setCapacity(60);
                lab1.setSoftware("VS Code, Docker, IntelliJ IDEA, Python 3.11");
                lab1.setAvailable(true);

                CourseLab lab2 = new CourseLab();
                lab2.setLabName("Advanced Robotics Lab");
                lab2.setLocation("Innovation Center, Ground Floor");
                lab2.setCapacity(25);
                lab2.setSoftware("ROS 2, MATLAB, SolidWorks, Arduino IDE");
                lab2.setAvailable(true);

                CourseLab lab3 = new CourseLab();
                lab3.setLabName("Cyber Security Ops Center");
                lab3.setLocation("Admin Building, Level 4");
                lab3.setCapacity(40);
                lab3.setSoftware("Kali Linux, Wireshark, Metasploit, Splunk");
                lab3.setAvailable(false);

                CourseLab lab4 = new CourseLab();
                lab4.setLabName("Mac Multimedia Suite");
                lab4.setLocation("Design Studio, Level 2");
                lab4.setCapacity(30);
                lab4.setSoftware("Adobe Creative Cloud, Final Cut Pro, Figma");
                lab4.setAvailable(true);

                repository.saveAll(Arrays.asList(lab1, lab2, lab3, lab4));
                System.out.println(">> Smart Campus Lab Directory Initialized.");
            }
        };
    }
}
