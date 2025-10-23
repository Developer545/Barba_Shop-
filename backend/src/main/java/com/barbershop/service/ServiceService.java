package com.barbershop.service;

import com.barbershop.dto.CreateServiceRequestDto;
import com.barbershop.dto.ServiceDto;
import com.barbershop.entity.Service;
import com.barbershop.entity.ServiceCategory;
import com.barbershop.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public List<ServiceDto> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrueOrderByNameAsc().stream()
            .map(this::convertToServiceDto)
            .collect(Collectors.toList());
    }

    public ServiceDto getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return convertToServiceDto(service);
    }

    public List<ServiceDto> getServicesByCategory(ServiceCategory category) {
        return serviceRepository.findByCategoryAndIsActiveTrue(category).stream()
            .map(this::convertToServiceDto)
            .collect(Collectors.toList());
    }

    public ServiceDto createService(CreateServiceRequestDto request) {
        Service service = new Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDuration(request.getDuration());
        service.setCategory(request.getCategory());
        service.setImage(request.getImage() != null ? request.getImage() : generateDefaultImage());
        service.setIsActive(true);

        Service savedService = serviceRepository.save(service);
        return convertToServiceDto(savedService);
    }

    public ServiceDto updateService(Long id, CreateServiceRequestDto request) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDuration(request.getDuration());
        service.setCategory(request.getCategory());
        if (request.getImage() != null) {
            service.setImage(request.getImage());
        }

        Service updatedService = serviceRepository.save(service);
        return convertToServiceDto(updatedService);
    }

    public void deactivateService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        service.setIsActive(false);
        serviceRepository.save(service);
    }

    public void activateService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        service.setIsActive(true);
        serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        serviceRepository.delete(service);
    }

    public long getActiveServiceCount() {
        return serviceRepository.countActiveServices();
    }

    private ServiceDto convertToServiceDto(Service service) {
        ServiceDto serviceDto = new ServiceDto();
        serviceDto.setId(service.getId());
        serviceDto.setName(service.getName());
        serviceDto.setDescription(service.getDescription());
        serviceDto.setPrice(service.getPrice());
        serviceDto.setDuration(service.getDuration());
        serviceDto.setImage(service.getImage());
        serviceDto.setCategory(service.getCategory());
        serviceDto.setIsActive(service.getIsActive());
        return serviceDto;
    }

    private String generateDefaultImage() {
        return "/assets/images/services/default.svg";
    }
}