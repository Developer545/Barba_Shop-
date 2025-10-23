package com.barbershop.service;

import com.barbershop.dto.AppointmentDto;
import com.barbershop.dto.CreateAppointmentRequestDto;
import com.barbershop.entity.*;
import com.barbershop.repository.AppointmentRepository;
import com.barbershop.repository.ServiceRepository;
import com.barbershop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
            .map(this::convertToAppointmentDto)
            .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByClient(Long clientId) {
        System.out.println("DEBUG - AppointmentService: Searching appointments for clientId: " + clientId);
        List<Appointment> appointments = appointmentRepository.findByClientIdOrderByDateDescTimeDesc(clientId);
        System.out.println("DEBUG - AppointmentService: Found " + appointments.size() + " appointments in database");
        for (Appointment apt : appointments) {
            System.out.println("DEBUG - Appointment ID: " + apt.getId() + ", Client ID: " + apt.getClient().getId() + ", Service: " + apt.getService().getName());
        }
        return appointments.stream()
            .map(this::convertToAppointmentDto)
            .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByBarber(Long barberId) {
        return appointmentRepository.findByBarberIdOrderByDateAscTimeAsc(barberId).stream()
            .map(this::convertToAppointmentDto)
            .collect(Collectors.toList());
    }

    public List<AppointmentDto> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByDateOrderByTimeAsc(date).stream()
            .map(this::convertToAppointmentDto)
            .collect(Collectors.toList());
    }

    public List<AppointmentDto> getUpcomingAppointments() {
        return appointmentRepository.findUpcomingAppointments(LocalDate.now()).stream()
            .map(this::convertToAppointmentDto)
            .collect(Collectors.toList());
    }

    public AppointmentDto createAppointment(CreateAppointmentRequestDto request, Long clientId) {
        // Validar que el barbero existe y está activo
        User barber = userRepository.findById(request.getBarberId())
            .orElseThrow(() -> new RuntimeException("Barber not found"));

        if (!barber.getRole().getName().equals("BARBER") || !barber.getIsActive()) {
            throw new RuntimeException("Invalid barber");
        }

        // Validar que el cliente existe
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client not found"));

        // Validar que el servicio existe y está activo
        com.barbershop.entity.Service service = serviceRepository.findById(request.getServiceId())
            .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.getIsActive()) {
            throw new RuntimeException("Service is not active");
        }

        // Verificar disponibilidad (que no haya otra cita en la misma fecha/hora/barbero)
        List<Appointment> conflictingAppointments = appointmentRepository.findByDateAndTimeAndBarberId(
            request.getDate(), request.getTime(), request.getBarberId());

        if (!conflictingAppointments.isEmpty()) {
            throw new RuntimeException("Time slot is not available");
        }

        // Crear la cita
        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setBarber(barber);
        appointment.setService(service);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setNotes(request.getNotes());
        appointment.setTotalPrice(service.getPrice());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return convertToAppointmentDto(savedAppointment);
    }

    public AppointmentDto updateAppointmentStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);

        if (status == AppointmentStatus.COMPLETED) {
            appointment.setCompletedAt(LocalDateTime.now());
        } else if (status == AppointmentStatus.CANCELLED) {
            appointment.setCancelledAt(LocalDateTime.now());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return convertToAppointmentDto(updatedAppointment);
    }

    public void cancelAppointment(Long appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(LocalDateTime.now());
        appointment.setCancellationReason(reason);

        appointmentRepository.save(appointment);
    }

    public long getTotalAppointmentCount() {
        return appointmentRepository.count();
    }

    public long getAppointmentCountByDate(LocalDate date) {
        return appointmentRepository.countByDate(date);
    }

    public BigDecimal getRevenueBetweenDates(LocalDate startDate, LocalDate endDate) {
        BigDecimal revenue = appointmentRepository.sumRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    public void deleteAllAppointments() {
        appointmentRepository.deleteAll();
    }

    private AppointmentDto convertToAppointmentDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setClientId(appointment.getClient().getId());
        dto.setClientName(appointment.getClient().getName());
        dto.setClientEmail(appointment.getClient().getEmail());
        dto.setClientPhone(appointment.getClient().getPhone());
        dto.setBarberId(appointment.getBarber().getId());
        dto.setBarberName(appointment.getBarber().getName());
        dto.setServiceId(appointment.getService().getId());
        dto.setServiceName(appointment.getService().getName());
        dto.setServicePrice(appointment.getService().getPrice());
        dto.setServiceDuration(appointment.getService().getDuration());
        dto.setDate(appointment.getDate());
        dto.setTime(appointment.getTime());
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());
        dto.setTotalPrice(appointment.getTotalPrice());
        dto.setCreatedAt(appointment.getCreatedAt());
        return dto;
    }
}