package com.barbershop.dto;

import com.barbershop.entity.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppointmentDto {
    private Long id;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Long barberId;
    private String barberName;
    private Long serviceId;
    private String serviceName;
    private BigDecimal servicePrice;
    private Integer serviceDuration;
    private LocalDate date;
    private LocalTime time;
    private AppointmentStatus status;
    private String notes;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;

    // Constructors
    public AppointmentDto() {}

    public AppointmentDto(Long clientId, Long barberId, Long serviceId, LocalDate date, LocalTime time, BigDecimal totalPrice) {
        this.clientId = clientId;
        this.barberId = barberId;
        this.serviceId = serviceId;
        this.date = date;
        this.time = time;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public Long getBarberId() { return barberId; }
    public void setBarberId(Long barberId) { this.barberId = barberId; }

    public String getBarberName() { return barberName; }
    public void setBarberName(String barberName) { this.barberName = barberName; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public BigDecimal getServicePrice() { return servicePrice; }
    public void setServicePrice(BigDecimal servicePrice) { this.servicePrice = servicePrice; }

    public Integer getServiceDuration() { return serviceDuration; }
    public void setServiceDuration(Integer serviceDuration) { this.serviceDuration = serviceDuration; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}