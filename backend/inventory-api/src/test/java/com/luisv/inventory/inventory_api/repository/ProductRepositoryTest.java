
package com.luisv.inventory.inventory_api.repository;

import com.luisv.inventory.inventory_api.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class ProductRepositoryTest {

    private ProductRepository repository;

    @BeforeEach
    void setUp() {
        repository = new ProductRepository();
    }

    @Test
    void testSaveAndFindById() {
        Product product = createSampleProduct();
        Product saved = repository.save(product);

        Optional<Product> retrieved = repository.findById(saved.getId());
        assertTrue(retrieved.isPresent());
        assertEquals(saved.getId(), retrieved.get().getId());
        assertEquals("Test Product", retrieved.get().getName());
    }

    @Test
    void testFindAll() {
        repository.save(createSampleProduct());
        repository.save(createSampleProduct());

        List<Product> products = repository.findAll();
        assertEquals(2, products.size());
    }

    @Test
    void testUpdate() {
        Product product = repository.save(createSampleProduct());
        product.setName("Updated Name");

        Product updated = repository.update(product.getId(), product);
        assertEquals("Updated Name", updated.getName());

        Optional<Product> found = repository.findById(product.getId());
        assertTrue(found.isPresent());
        assertEquals("Updated Name", found.get().getName());
    }

    @Test
    void testDelete() {
        Product product = repository.save(createSampleProduct());

        repository.delete(product.getId());
        Optional<Product> deleted = repository.findById(product.getId());
        assertTrue(deleted.isEmpty());
    }

    private Product createSampleProduct() {
        Product p = new Product();
        p.setName("Test Product");
        p.setCategory("Test");
        p.setUnitPrice(99.99);
        p.setQuantityInStock(10);
        p.setExpirationDate(LocalDate.now().plusDays(30));
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        return p;
    }
}
