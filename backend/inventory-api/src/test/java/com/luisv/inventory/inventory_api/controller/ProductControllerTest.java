
package com.luisv.inventory.inventory_api.controller;

import com.luisv.inventory.inventory_api.exception.ProductNotFoundException;
import com.luisv.inventory.inventory_api.model.Product;
import com.luisv.inventory.inventory_api.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private ProductService service;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product();
        sampleProduct.setId(1L);
        sampleProduct.setName("Laptop");
        sampleProduct.setCategory("Electronics");
        sampleProduct.setUnitPrice(1000.0);
    }

    @Test
    void shouldReturnAllProducts() throws Exception {
        when(service.getAllProducts()).thenReturn(List.of(sampleProduct));

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Laptop"));
    }

    @Test
    void shouldCreateProduct() throws Exception {
        when(service.createProduct(any(Product.class))).thenReturn(sampleProduct);

        String json = "{\"name\":\"Laptop\",\"category\":\"Electronics\",\"inStock\":true,\"price\":1000.0}";

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    void shouldMarkProductOutOfStock() throws Exception {
        sampleProduct.setInStock(false);
        when(service.markOutOfStock(1L)).thenReturn(sampleProduct);

        mockMvc.perform(post("/products/1/outofstock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.inStock").value(false));
    }

    @Test
    void shouldGetDistinctCategories() throws Exception {
        Product p1 = new Product(); p1.setCategory("Electronics");
        Product p2 = new Product(); p2.setCategory("Books");

        when(service.getAllProducts()).thenReturn(Arrays.asList(p1, p2));

        mockMvc.perform(get("/products/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Electronics"));
    }

    @Test
    void shouldReturn404WhenProductNotFound() throws Exception {
        Long nonexistentId = 999L;

        doThrow(new ProductNotFoundException(nonexistentId))
            .when(service).markOutOfStock(nonexistentId);

        mockMvc.perform(post("/products/" + nonexistentId + "/outofstock"))
                .andExpect(status().isNotFound());
    }
}
