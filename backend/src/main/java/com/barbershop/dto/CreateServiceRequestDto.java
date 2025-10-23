package com.barbershop.dto;

import com.barbershop.entity.ServiceCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CreateServiceRequestDto {
    @NotBlank(message = "Service name is required")
    @Size(min = 2, max = 100, message = "Service name must be between 2 and 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer duration;

    @NotNull(message = "Category is required")
    private ServiceCategory category;

    private String image;

    // Constructors
    public CreateServiceRequestDto() {}

    public CreateServiceRequestDto(String name, String description, BigDecimal price, Integer duration, ServiceCategory category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.category = category;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}