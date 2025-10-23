package com.barbershop.controller;

import com.barbershop.dto.BarberDto;
import com.barbershop.dto.ServiceDto;
import com.barbershop.entity.ServiceCategory;
import com.barbershop.service.BarberService;
import com.barbershop.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicController {

    @Autowired
    private BarberService barberService;

    @Autowired
    private ServiceService serviceService;

    // ===== PUBLIC BARBER ENDPOINTS =====
    @GetMapping("/barbers")
    public ResponseEntity<List<BarberDto>> getAllBarbers() {
        return ResponseEntity.ok(barberService.getAllActiveBarbers());
    }

    @GetMapping("/barbers/{id}")
    public ResponseEntity<BarberDto> getBarberById(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getBarberById(id));
    }

    @GetMapping("/barbers/specialty/{specialty}")
    public ResponseEntity<List<BarberDto>> getBarbersBySpecialty(@PathVariable String specialty) {
        return ResponseEntity.ok(barberService.getBarbersBySpecialty(specialty));
    }

    // ===== PUBLIC SERVICE ENDPOINTS =====
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @GetMapping("/services/category/{category}")
    public ResponseEntity<List<ServiceDto>> getServicesByCategory(@PathVariable ServiceCategory category) {
        return ResponseEntity.ok(serviceService.getServicesByCategory(category));
    }
}