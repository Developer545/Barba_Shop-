package com.barbershop.entity;

public enum AppointmentStatus {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;

    AppointmentStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}