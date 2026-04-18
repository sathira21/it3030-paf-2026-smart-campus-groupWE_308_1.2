package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveResources() {
        List<Resource> resources = resourceService.getActiveResources();
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Resource not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceService.convertToMap(resource));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Map<String, Object>> getResourcesByType(@PathVariable String type) {
        List<Resource> resources = resourceService.getResourcesByType(type);
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(@RequestParam String keyword) {
        List<Resource> resources = resourceService.searchResources(keyword);
        List<Map<String, Object>> resourceMaps = resources.stream()
                .map(resourceService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", resourceMaps);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createResource(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "capacity", required = false) String capacity,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam(value = "features", required = false) String features,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "rules", required = false) String rules,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        try {
            Map<String, Object> resourceData = new HashMap<>();
            resourceData.put("name", name);
            resourceData.put("type", type);
            resourceData.put("capacity", capacity);
            resourceData.put("location", location);
            resourceData.put("description", description);
            resourceData.put("amenities", amenities);
            resourceData.put("features", features);
            resourceData.put("contactPerson", contactPerson);
            resourceData.put("contactEmail", contactEmail);
            resourceData.put("rules", rules);

            Resource resource = resourceService.createResource(resourceData, images);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource created successfully");
            response.put("data", resourceService.convertToMap(resource));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            String msg = e.getMessage();
            if (msg == null || msg.isEmpty()) msg = e.toString();
            response.put("message", msg);
            response.put("errorClass", e.getClass().getName());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "capacity", required = false) String capacity,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "amenities", required = false) String amenities,
            @RequestParam(value = "features", required = false) String features,
            @RequestParam(value = "contactPerson", required = false) String contactPerson,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "rules", required = false) String rules,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "keepImages", required = false) String keepImages,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        try {
            Map<String, Object> resourceData = new HashMap<>();
            resourceData.put("name", name);
            resourceData.put("type", type);
            resourceData.put("capacity", capacity);
            resourceData.put("location", location);
            resourceData.put("description", description);
            resourceData.put("amenities", amenities);
            resourceData.put("features", features);
            resourceData.put("contactPerson", contactPerson);
            resourceData.put("contactEmail", contactEmail);
            resourceData.put("rules", rules);
            resourceData.put("status", status != null ? status : "ACTIVE");
            resourceData.put("keepImages", keepImages);

            Resource resource = resourceService.updateResource(id, resourceData, images);

            if (resource == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Resource not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resource updated successfully");
            response.put("data", resourceService.convertToMap(resource));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            String msg = e.getMessage();
            if (msg == null || msg.isEmpty()) msg = e.toString();
            response.put("message", msg);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable Long id) {
        boolean deleted = resourceService.deleteResource(id);

        if (!deleted) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Resource not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Resource deleted successfully");
        return ResponseEntity.ok(response);
    }
}