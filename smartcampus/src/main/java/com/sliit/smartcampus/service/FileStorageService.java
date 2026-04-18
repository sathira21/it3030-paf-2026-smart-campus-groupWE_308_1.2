package com.sliit.smartcampus.service;

import com.sliit.smartcampus.exception.FileValidationException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List<String> storeFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new FileValidationException("No files were uploaded.");
        }

        if (files.length > 3) {
            throw new FileValidationException("Cannot upload more than 3 files.");
        }

        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/png");
        List<String> filePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new FileValidationException("Failed to store empty file.");
            }

            if (!allowedTypes.contains(file.getContentType())) {
                throw new FileValidationException("File type not allowed. Only JPEG and PNG are accepted. Discovered: " + file.getContentType());
            }

            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalFileName.contains("..")) {
                throw new FileValidationException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }
            
            String newFileName = UUID.randomUUID().toString() + extension;

            try {
                Path targetLocation = this.fileStorageLocation.resolve(newFileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                
                // Return a relative path or an absolute path/URL. 
                // We'll store a mock URL prefix /uploads/ to serve them later (static routing).
                filePaths.add("/uploads/" + newFileName);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + newFileName + ". Please try again!", ex);
            }
        }
        return filePaths;
    }
}
