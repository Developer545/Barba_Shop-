package com.barbershop.controller;

import com.barbershop.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/upload")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class FileUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/service-image")
    public ResponseEntity<Map<String, String>> uploadServiceImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadFile(file, "barbershop/services");

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error uploading image: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/barber-image")
    public ResponseEntity<Map<String, String>> uploadBarberImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadFile(file, "barbershop/barbers");

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error uploading image: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
