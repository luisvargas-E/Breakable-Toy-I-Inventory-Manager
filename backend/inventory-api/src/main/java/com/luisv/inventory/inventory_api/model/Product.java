package com.luisv.inventory.inventory_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private Long id;
    private String name;
    private String category;
    private Double unitPrice;
    private LocalDate expirationDate;
    private Integer quantityInStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
}