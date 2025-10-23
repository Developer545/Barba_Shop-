package com.barbershop.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BarberExceptionDto {
    private Long id;
    private Long barberProfileId;
    private LocalDate exceptionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
    private String reason;
    private Boolean allDay;

    // Constructors
    public BarberExceptionDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
