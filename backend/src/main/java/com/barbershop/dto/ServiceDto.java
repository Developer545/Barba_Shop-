package com.barbershop.dto;

import com.barbershop.entity.ServiceCategory;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private String image;
    private ServiceCategory category;
    private Boolean isActive;

    // Constructors
    public ServiceDto() {}

    public ServiceDto(String name, String description, BigDecimal price, Integer duration, ServiceCategory category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}