package com.barbershop.entity;

public enum ServiceCategory {
    HAIRCUT("haircut"),
    BEARD("beard"),
    STYLING("styling"),
    TREATMENT("treatment");

    private final String value;

    ServiceCategory(String value) {
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