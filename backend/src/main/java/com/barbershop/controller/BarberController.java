package com.barbershop.controller;

import com.barbershop.config.UserPrincipal;
import com.barbershop.dto.AppointmentDto;
import com.barbershop.dto.BarberDto;
import com.barbershop.dto.BarberScheduleDto;
import com.barbershop.dto.BarberExceptionDto;
import com.barbershop.entity.AppointmentStatus;
import com.barbershop.service.AppointmentService;
import com.barbershop.service.BarberService;
import com.barbershop.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/barber")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasAnyRole('BARBER', 'ADMIN')")
public class BarberController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private BarberService barberService;

    @Autowired
    private ScheduleService scheduleService;

    // ===== BARBER PROFILE =====
    @GetMapping("/profile")
    public ResponseEntity<BarberDto> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(barberService.getBarberByUserId(currentUser.getId()));
    }

    // ===== APPOINTMENT MANAGEMENT =====
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getMyAppointments(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByBarber(currentUser.getId()));
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<List<AppointmentDto>> getTodayAppointments(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<AppointmentDto> allAppointments = appointmentService.getAppointmentsByBarber(currentUser.getId());
        List<AppointmentDto> todayAppointments = allAppointments.stream()
                .filter(appointment -> appointment.getDate().equals(LocalDate.now()))
                .toList();
        return ResponseEntity.ok(todayAppointments);
    }

    @GetMapping("/appointments/date/{date}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDate(
            @PathVariable String date,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<AppointmentDto> allAppointments = appointmentService.getAppointmentsByBarber(currentUser.getId());
        List<AppointmentDto> dateAppointments = allAppointments.stream()
                .filter(appointment -> appointment.getDate().equals(appointmentDate))
                .toList();
        return ResponseEntity.ok(dateAppointments);
    }

    @PutMapping("/appointments/{id}/confirm")
    public ResponseEntity<AppointmentDto> confirmAppointment(@PathVariable Long id) {
        AppointmentDto appointment = appointmentService.updateAppointmentStatus(id, AppointmentStatus.CONFIRMED);
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/appointments/{id}/complete")
    public ResponseEntity<AppointmentDto> completeAppointment(@PathVariable Long id) {
        AppointmentDto appointment = appointmentService.updateAppointmentStatus(id, AppointmentStatus.COMPLETED);
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, @RequestParam String reason) {
        appointmentService.cancelAppointment(id, reason);
        return ResponseEntity.ok().build();
    }

    // ===== SCHEDULE MANAGEMENT (READ-ONLY) =====

    // Ver mi horario semanal
    @GetMapping("/schedule")
    public ResponseEntity<List<BarberScheduleDto>> getMySchedule(@AuthenticationPrincipal UserPrincipal currentUser) {
        BarberDto barber = barberService.getBarberByUserId(currentUser.getId());
        List<BarberScheduleDto> schedule = scheduleService.getBarberSchedule(barber.getId());
        return ResponseEntity.ok(schedule);
    }

    // Ver mis excepciones/ausencias
    @GetMapping("/exceptions")
    public ResponseEntity<List<BarberExceptionDto>> getMyExceptions(@AuthenticationPrincipal UserPrincipal currentUser) {
        BarberDto barber = barberService.getBarberByUserId(currentUser.getId());
        List<BarberExceptionDto> exceptions = scheduleService.getBarberExceptions(barber.getId());
        return ResponseEntity.ok(exceptions);
    }

    // Ver excepciones en un rango de fechas
    @GetMapping("/exceptions/range")
    public ResponseEntity<List<BarberExceptionDto>> getMyExceptionsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BarberDto barber = barberService.getBarberByUserId(currentUser.getId());
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<BarberExceptionDto> exceptions = scheduleService.getBarberExceptionsByDateRange(barber.getId(), start, end);
        return ResponseEntity.ok(exceptions);
    }

    // Ver slots disponibles para una fecha
    @GetMapping("/available-slots")
    public ResponseEntity<List<java.time.LocalTime>> getMyAvailableTimeSlots(
            @RequestParam String date,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BarberDto barber = barberService.getBarberByUserId(currentUser.getId());
        LocalDate appointmentDate = LocalDate.parse(date);
        List<java.time.LocalTime> slots = scheduleService.getAvailableTimeSlots(barber.getId(), appointmentDate);
        return ResponseEntity.ok(slots);
    }
}