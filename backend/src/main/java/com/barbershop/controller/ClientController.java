package com.barbershop.controller;

import com.barbershop.config.UserPrincipal;
import com.barbershop.dto.AppointmentDto;
import com.barbershop.dto.CreateAppointmentRequestDto;
import com.barbershop.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
public class ClientController {

    @Autowired
    private AppointmentService appointmentService;

    // ===== APPOINTMENT MANAGEMENT =====
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getMyAppointments(@AuthenticationPrincipal UserPrincipal currentUser) {
        System.out.println("DEBUG - Getting appointments for client ID: " + currentUser.getId());
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByClient(currentUser.getId());
        System.out.println("DEBUG - Found " + appointments.size() + " appointments for client ID: " + currentUser.getId());
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDto> createAppointment(
            @Valid @RequestBody CreateAppointmentRequestDto request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        System.out.println("DEBUG - Creating appointment for client ID: " + currentUser.getId());
        System.out.println("DEBUG - Request data: barberId=" + request.getBarberId() +
                          ", serviceId=" + request.getServiceId() +
                          ", date=" + request.getDate() +
                          ", time=" + request.getTime());
        try {
            AppointmentDto appointment = appointmentService.createAppointment(request, currentUser.getId());
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            System.out.println("DEBUG - Error creating appointment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        appointmentService.cancelAppointment(id, reason != null ? reason : "Cancelled by client");
        return ResponseEntity.ok().build();
    }
}