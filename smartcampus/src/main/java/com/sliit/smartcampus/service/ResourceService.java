package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ImageStorageService imageStorageService;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public List<Resource> getActiveResources() {
        return resourceRepository.findByStatus("ACTIVE");
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }

    public List<Resource> searchResources(String keyword) {
        return resourceRepository.searchByKeyword(keyword);
    }

    public List<Resource> getPopularResources() {
        return resourceRepository.findByIsPopularTrue();
    }

    public Resource createResource(Map<String, Object> resourceData, List<MultipartFile> images) throws IOException {
        Resource resource = new Resource();

        Object nameObj = resourceData.get("name");
        Object typeObj = resourceData.get("type");
        Object capacityObj = resourceData.get("capacity");
        Object locationObj = resourceData.get("location");
        Object descriptionObj = resourceData.get("description");

        resource.setName(nameObj != null ? nameObj.toString() : "Unnamed Resource");
        resource.setType(typeObj != null ? typeObj.toString() : "OTHER");
        
        int capacity = 1;
        if (capacityObj != null) {
            try {
                capacity = Integer.parseInt(capacityObj.toString());
            } catch (NumberFormatException e) { capacity = 1; }
        }
        resource.setCapacity(capacity);

        resource.setLocation(locationObj != null ? locationObj.toString() : "Unknown Location");
        resource.setDescription(descriptionObj != null ? descriptionObj.toString() : "No description provided.");

        if (resourceData.containsKey("amenities")) {
            String amenitiesStr = (String) resourceData.get("amenities");
            List<String> amenities = new ArrayList<>();
            if (amenitiesStr != null && !amenitiesStr.isEmpty()) {
                for (String a : amenitiesStr.split(",")) {
                    amenities.add(a.trim());
                }
            }
            resource.setAmenities(amenities);
        }

        if (resourceData.containsKey("features")) {
            String featuresStr = (String) resourceData.get("features");
            List<String> features = new ArrayList<>();
            if (featuresStr != null && !featuresStr.isEmpty()) {
                for (String f : featuresStr.split(",")) {
                    features.add(f.trim());
                }
            }
            resource.setFeatures(features);
        }

        resource.setContactPerson((String) resourceData.get("contactPerson"));
        resource.setContactEmail((String) resourceData.get("contactEmail"));
        resource.setRules((String) resourceData.get("rules"));

        if (resourceData.get("pricePerHour") != null) {
            resource.setPricePerHour(Double.parseDouble(resourceData.get("pricePerHour").toString()));
        }

        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = imageStorageService.saveImages(images);
            resource.setImages(imageUrls);
        }

        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Map<String, Object> resourceData, List<MultipartFile> newImages) throws IOException {
        Resource resource = getResourceById(id);
        if (resource == null) return null;

        if (resourceData.containsKey("name")) resource.setName((String) resourceData.get("name"));
        if (resourceData.containsKey("type")) resource.setType((String) resourceData.get("type"));
        if (resourceData.containsKey("capacity")) {
            Object capObj = resourceData.get("capacity");
            int capacity = resource.getCapacity();
            if (capObj != null) {
                try {
                    capacity = Integer.parseInt(capObj.toString());
                } catch (NumberFormatException e) { /* keep legacy */ }
            }
            resource.setCapacity(capacity);
        }
        if (resourceData.containsKey("location")) resource.setLocation((String) resourceData.get("location"));
        if (resourceData.containsKey("description")) resource.setDescription((String) resourceData.get("description"));
        if (resourceData.containsKey("contactPerson")) resource.setContactPerson((String) resourceData.get("contactPerson"));
        if (resourceData.containsKey("contactEmail")) resource.setContactEmail((String) resourceData.get("contactEmail"));
        if (resourceData.containsKey("rules")) resource.setRules((String) resourceData.get("rules"));
        if (resourceData.containsKey("status")) resource.setStatus((String) resourceData.get("status"));

        if (resourceData.containsKey("amenities")) {
            String amenitiesStr = (String) resourceData.get("amenities");
            List<String> amenities = new ArrayList<>();
            if (amenitiesStr != null && !amenitiesStr.isEmpty()) {
                for (String a : amenitiesStr.split(",")) {
                    amenities.add(a.trim());
                }
            }
            resource.setAmenities(amenities);
        }

        if (resourceData.containsKey("features")) {
            String featuresStr = (String) resourceData.get("features");
            List<String> features = new ArrayList<>();
            if (featuresStr != null && !featuresStr.isEmpty()) {
                for (String f : featuresStr.split(",")) {
                    features.add(f.trim());
                }
            }
            resource.setFeatures(features);
        }

        // Handle images:
        // keepImages = comma-separated list of existing server image URLs to KEEP (from client)
        // If keepImages is provided, respect it; else keep all current images
        String keepImagesParam = resourceData.containsKey("keepImages") ? (String) resourceData.get("keepImages") : null;
        List<String> baseImages;
        if (keepImagesParam != null) {
            baseImages = new ArrayList<>();
            if (!keepImagesParam.trim().isEmpty()) {
                for (String url : keepImagesParam.split(",")) {
                    String trimmed = url.trim();
                    if (!trimmed.isEmpty()) baseImages.add(trimmed);
                }
            }
        } else {
            baseImages = resource.getImages() != null ? new ArrayList<>(resource.getImages()) : new ArrayList<>();
        }

        if (newImages != null && !newImages.isEmpty()) {
            List<String> newImageUrls = imageStorageService.saveImages(newImages);
            baseImages.addAll(newImageUrls);
        }
        resource.setImages(baseImages);


        return resourceRepository.save(resource);
    }

    @Transactional
    public boolean deleteResource(Long id) {
        Resource resource = getResourceById(id);
        if (resource == null) return false;

        // Note: BookingRepository doesn't have findByResource yet, but we'll add it or use a query.
        // Actually, the new Booking model has @ManyToOne Resource resource.
        // We'll add findByResource to BookingRepository.
        
        resourceRepository.delete(resource);
        return true;
    }

    public Map<String, Object> convertToMap(Resource resource) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", resource.getId());
        map.put("name", resource.getName());
        map.put("type", resource.getType());
        map.put("capacity", resource.getCapacity());
        map.put("location", resource.getLocation());
        map.put("description", resource.getDescription());
        map.put("amenities", resource.getAmenities());
        map.put("features", resource.getFeatures());
        map.put("images", resource.getImages());
        map.put("status", resource.getStatus());
        map.put("contactPerson", resource.getContactPerson());
        map.put("contactEmail", resource.getContactEmail());
        map.put("rules", resource.getRules());
        map.put("pricePerHour", resource.getPricePerHour());
        map.put("rating", resource.getRating());
        map.put("reviewCount", resource.getReviewCount());
        map.put("isPopular", resource.getIsPopular());
        map.put("createdAt", resource.getCreatedAt());
        map.put("updatedAt", resource.getUpdatedAt());
        return map;
    }
}
