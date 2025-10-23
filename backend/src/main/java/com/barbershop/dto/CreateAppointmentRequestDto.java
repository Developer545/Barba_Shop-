package com.barbershop.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateAppointmentRequestDto {
    @NotNull(message = "Barber ID is required")
    private Long barberId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Time is required")
    private LocalTime time;

    private String notes;

    // Constructors
    public CreateAppointmentRequestDto() {}

    public CreateAppointmentRequestDto(Long barberId, Long serviceId, LocalDate date, LocalTime time) {
        this.barberId = barberId;
        this.serviceId = serviceId;
        this.date = date;
        this.time = time;
    }

    // Getters and Setters
    public Long getBarberId() { return barberId; }
    public void setBarberId(Long barberId) { this.barberId = barberId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}