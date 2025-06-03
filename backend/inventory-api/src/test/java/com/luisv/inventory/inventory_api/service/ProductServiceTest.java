package com.luisv.inventory.inventory_api.service;

import com.luisv.inventory.inventory_api.model.Product;
import com.luisv.inventory.inventory_api.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductServiceTest {

    private ProductRepository repo;
    private ProductService service;

    @BeforeEach
    public void setup() {
        repo = mock(ProductRepository.class);
        service = new ProductService(repo);
    }

    @Test
    public void testGetAllProducts() {
        List<Product> mockProducts = List.of(new Product(), new Product());
        when(repo.findAll()).thenReturn(mockProducts);

        List<Product> result = service.getAllProducts();

        assertEquals(2, result.size());
        verify(repo, times(1)).findAll();
    }

    @Test
    public void testCreateProduct() {
        Product product = new Product();
        when(repo.save(any(Product.class))).thenReturn(product);

        Product created = service.createProduct(product);

        assertNotNull(created);
        assertNotNull(created.getCreatedAt());
        assertNotNull(created.getUpdatedAt());
        verify(repo).save(product);
    }

    @Test
    public void testUpdateProduct() {
        Product existing = new Product();
        existing.setId(1L);
        when(repo.update(eq(1L), any(Product.class))).thenReturn(existing);

        Product updated = service.updateProduct(1L, existing);

        assertNotNull(updated);
        assertNotNull(updated.getUpdatedAt());
        verify(repo).update(1L, existing);
    }

    @Test
    public void testDeleteProduct() {
        doNothing().when(repo).delete(1L);

        service.deleteProduct(1L);

        verify(repo, times(1)).delete(1L);
    }
}
