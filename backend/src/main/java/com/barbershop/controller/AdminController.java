package com.barbershop.controller;

import com.barbershop.dto.*;
import com.barbershop.entity.AppointmentStatus;
import com.barbershop.entity.ServiceCategory;
import com.barbershop.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private BarberService barberService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private ScheduleService scheduleService;

    // ===== DASHBOARD STATS =====
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Estadísticas de usuarios
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("totalClients", userService.getUserCountByRoleName("CLIENT"));
        stats.put("totalBarbers", barberService.getActiveBarberCount());
        stats.put("totalServices", serviceService.getActiveServiceCount());

        // Estadísticas de citas
        stats.put("totalAppointments", appointmentService.getTotalAppointmentCount());
        stats.put("appointmentsToday", appointmentService.getAppointmentCountByDate(LocalDate.now()));

        // Ingresos del mes actual
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        BigDecimal monthlyRevenue = appointmentService.getRevenueBetweenDates(startOfMonth, endOfMonth);
        stats.put("monthlyRevenue", monthlyRevenue);

        return ResponseEntity.ok(stats);
    }

    // ===== USER MANAGEMENT =====
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequestDto request) {
        UserDto user = userService.createUser(request);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long userId, @Valid @RequestBody UpdateUserRequestDto request) {
        UserDto user = userService.updateUser(userId, request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRoleName(role));
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    // ===== BARBER MANAGEMENT =====
    @GetMapping("/barbers")
    public ResponseEntity<List<BarberDto>> getAllBarbers() {
        return ResponseEntity.ok(barberService.getAllActiveBarbers());
    }

    @PostMapping("/barbers")
    public ResponseEntity<BarberDto> createBarber(@Valid @RequestBody CreateBarberRequestDto request) {
        BarberDto barber = barberService.createBarber(request);
        return ResponseEntity.ok(barber);
    }

    @GetMapping("/barbers/{id}")
    public ResponseEntity<BarberDto> getBarberById(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getBarberById(id));
    }

    @PutMapping("/barbers/{id}")
    public ResponseEntity<BarberDto> updateBarber(@PathVariable Long id,
                                                @Valid @RequestBody CreateBarberRequestDto request) {
        BarberDto barber = barberService.updateBarber(id, request);
        return ResponseEntity.ok(barber);
    }

    @PutMapping("/barbers/{id}/deactivate")
    public ResponseEntity<Void> deactivateBarber(@PathVariable Long id) {
        barberService.deactivateBarber(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/barbers/{id}/activate")
    public ResponseEntity<Void> activateBarber(@PathVariable Long id) {
        barberService.activateBarber(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/barbers/{id}")
    public ResponseEntity<Void> deleteBarber(@PathVariable Long id) {
        barberService.deleteBarber(id);
        return ResponseEntity.ok().build();
    }

    // ===== SERVICE MANAGEMENT =====
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDto>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceDto> createService(@Valid @RequestBody CreateServiceRequestDto request) {
        ServiceDto service = serviceService.createService(request);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceDto> updateService(@PathVariable Long id,
                                                   @Valid @RequestBody CreateServiceRequestDto request) {
        ServiceDto service = serviceService.updateService(id, request);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/services/{id}/deactivate")
    public ResponseEntity<Void> deactivateService(@PathVariable Long id) {
        serviceService.deactivateService(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/services/{id}/activate")
    public ResponseEntity<Void> activateService(@PathVariable Long id) {
        serviceService.activateService(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/services/category/{category}")
    public ResponseEntity<List<ServiceDto>> getServicesByCategory(@PathVariable ServiceCategory category) {
        return ResponseEntity.ok(serviceService.getServicesByCategory(category));
    }

    // ===== APPOINTMENT MANAGEMENT =====
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<List<AppointmentDto>> getUpcomingAppointments() {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments());
    }

    @GetMapping("/appointments/date/{date}")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDate(@PathVariable String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(appointmentDate));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentDto> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status) {
        AppointmentDto appointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id, @RequestParam String reason) {
        appointmentService.cancelAppointment(id, reason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/appointments/all")
    public ResponseEntity<Void> deleteAllAppointments() {
        appointmentService.deleteAllAppointments();
        return ResponseEntity.ok().build();
    }

    // ===== REPORTS =====
    @GetMapping("/reports/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        BigDecimal revenue = appointmentService.getRevenueBetweenDates(start, end);

        Map<String, Object> report = new HashMap<>();
        report.put("startDate", start);
        report.put("endDate", end);
        report.put("totalRevenue", revenue);

        return ResponseEntity.ok(report);
    }

    // ===== SCHEDULE MANAGEMENT =====

    // Obtener horario semanal de un barbero
    @GetMapping("/barbers/{barberId}/schedule")
    public ResponseEntity<List<BarberScheduleDto>> getBarberSchedule(@PathVariable Long barberId) {
        List<BarberScheduleDto> schedule = scheduleService.getBarberSchedule(barberId);
        return ResponseEntity.ok(schedule);
    }

    // Crear horario para un día específico
    @PostMapping("/barbers/{barberId}/schedule")
    public ResponseEntity<BarberScheduleDto> createBarberSchedule(
            @PathVariable Long barberId,
            @Valid @RequestBody UpdateBarberScheduleRequestDto request) {
        BarberScheduleDto schedule = scheduleService.createBarberSchedule(barberId, request);
        return ResponseEntity.ok(schedule);
    }

    // Actualizar todo el horario semanal de un barbero
    @PutMapping("/barbers/{barberId}/schedule")
    public ResponseEntity<List<BarberScheduleDto>> updateFullWeekSchedule(
            @PathVariable Long barberId,
            @Valid @RequestBody List<UpdateBarberScheduleRequestDto> schedules) {
        List<BarberScheduleDto> updatedSchedules = scheduleService.updateFullWeekSchedule(barberId, schedules);
        return ResponseEntity.ok(updatedSchedules);
    }

    // Actualizar un horario específico
    @PutMapping("/schedule/{scheduleId}")
    public ResponseEntity<BarberScheduleDto> updateBarberSchedule(
            @PathVariable Long scheduleId,
            @Valid @RequestBody UpdateBarberScheduleRequestDto request) {
        BarberScheduleDto schedule = scheduleService.updateBarberSchedule(scheduleId, request);
        return ResponseEntity.ok(schedule);
    }

    // Eliminar un horario específico
    @DeleteMapping("/schedule/{scheduleId}")
    public ResponseEntity<Void> deleteBarberSchedule(@PathVariable Long scheduleId) {
        scheduleService.deleteBarberSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }

    // ===== EXCEPTION MANAGEMENT =====

    // Obtener todas las excepciones de un barbero
    @GetMapping("/barbers/{barberId}/exceptions")
    public ResponseEntity<List<BarberExceptionDto>> getBarberExceptions(@PathVariable Long barberId) {
        List<BarberExceptionDto> exceptions = scheduleService.getBarberExceptions(barberId);
        return ResponseEntity.ok(exceptions);
    }

    // Obtener excepciones por rango de fechas
    @GetMapping("/barbers/{barberId}/exceptions/range")
    public ResponseEntity<List<BarberExceptionDto>> getBarberExceptionsByDateRange(
            @PathVariable Long barberId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<BarberExceptionDto> exceptions = scheduleService.getBarberExceptionsByDateRange(barberId, start, end);
        return ResponseEntity.ok(exceptions);
    }

    // Crear una excepción (ausencia/cambio temporal)
    @PostMapping("/barbers/exceptions")
    public ResponseEntity<BarberExceptionDto> createBarberException(
            @Valid @RequestBody CreateBarberExceptionRequestDto request) {
        BarberExceptionDto exception = scheduleService.createBarberException(request);
        return ResponseEntity.ok(exception);
    }

    // Actualizar una excepción
    @PutMapping("/barbers/exceptions/{exceptionId}")
    public ResponseEntity<BarberExceptionDto> updateBarberException(
            @PathVariable Long exceptionId,
            @Valid @RequestBody CreateBarberExceptionRequestDto request) {
        BarberExceptionDto exception = scheduleService.updateBarberException(exceptionId, request);
        return ResponseEntity.ok(exception);
    }

    // Eliminar una excepción
    @DeleteMapping("/barbers/exceptions/{exceptionId}")
    public ResponseEntity<Void> deleteBarberException(@PathVariable Long exceptionId) {
        scheduleService.deleteBarberException(exceptionId);
        return ResponseEntity.noContent().build();
    }

    // Verificar disponibilidad de un barbero
    @GetMapping("/barbers/{barberId}/availability")
    public ResponseEntity<Map<String, Object>> checkBarberAvailability(
            @PathVariable Long barberId,
            @RequestParam String date,
            @RequestParam String time) {
        LocalDate appointmentDate = LocalDate.parse(date);
        java.time.LocalTime appointmentTime = java.time.LocalTime.parse(time);

        boolean isAvailable = scheduleService.isBarberAvailable(barberId, appointmentDate, appointmentTime);

        Map<String, Object> response = new HashMap<>();
        response.put("barberId", barberId);
        response.put("date", appointmentDate);
        response.put("time", appointmentTime);
        response.put("isAvailable", isAvailable);

        return ResponseEntity.ok(response);
    }

    // Obtener horarios disponibles para una fecha
    @GetMapping("/barbers/{barberId}/available-slots")
    public ResponseEntity<List<java.time.LocalTime>> getAvailableTimeSlots(
            @PathVariable Long barberId,
            @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<java.time.LocalTime> slots = scheduleService.getAvailableTimeSlots(barberId, appointmentDate);
        return ResponseEntity.ok(slots);
    }
}