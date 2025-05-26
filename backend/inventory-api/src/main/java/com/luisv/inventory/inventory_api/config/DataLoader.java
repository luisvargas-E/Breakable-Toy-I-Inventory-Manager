package com.luisv.inventory.inventory_api.config;

import java.io.InputStream;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.luisv.inventory.inventory_api.repository.ProductRepository;
import com.luisv.inventory.inventory_api.model.Product;

import jakarta.annotation.PostConstruct;
import  lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final ProductRepository productRepository;

    @PostConstruct
    public void loadData() {
        try {
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            InputStream inputStream = getClass()
                    .getResourceAsStream("/data/sample_products.json");
            List<Product> products = mapper.readValue(inputStream, new TypeReference<>() {});
            products.forEach(productRepository::save);
            System.out.println("Sample data loaded: " + products.size() + "products");
        } catch (Exception e) {
            System.err.println("Failed to load sample data: " + e.getMessage());
        }
    }
    
}
