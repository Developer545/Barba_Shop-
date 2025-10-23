package com.barbershop.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateBarberExceptionRequestDto {
    @NotNull(message = "Barber profile ID is required")
    private Long barberProfileId;

    @NotNull(message = "Exception date is required")
    private LocalDate exceptionDate;

    private LocalTime startTime;
    private LocalTime endTime;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    private String reason;

    @NotNull(message = "All day flag is required")
    private Boolean allDay;

    // Constructors
    public CreateBarberExceptionRequestDto() {}

    // Getters and Setters
    public Long getBarberProfileId() { return barberProfileId; }
    public void setBarberProfileId(Long barberProfileId) { this.barberProfileId = barberProfileId; }

    public LocalDate getExceptionDate() { return exceptionDate; }
    public void setExceptionDate(LocalDate exceptionDate) { this.exceptionDate = exceptionDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Boolean getAllDay() { return allDay; }
    public void setAllDay(Boolean allDay) { this.allDay = allDay; }
}
