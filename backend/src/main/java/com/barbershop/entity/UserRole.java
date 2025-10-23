package com.barbershop.entity;

public enum UserRole {
    ADMIN("admin"),
    BARBER("barber"),
    CLIENT("client");

    private final String value;

    UserRole(String value) {
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