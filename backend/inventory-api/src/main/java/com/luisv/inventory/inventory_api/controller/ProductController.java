package com.luisv.inventory.inventory_api.controller;

import com.luisv.inventory.inventory_api.model.Product;
import com.luisv.inventory.inventory_api.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return service.createProduct(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }

    @PostMapping("/{id}/outofstock")
    public Product markOutOfStock(@PathVariable Long id) {
        return service.markOutOfStock(id);
    }

    @PutMapping("/{id}/instock")
    public Product markInStock(@PathVariable Long id) {
        return service.markInStock(id);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "name,asc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.search(name, categories, inStock, sortBy, page, size);
    }

    @GetMapping("/metrics")
    public Map<String, Object> getInventoryMetrics() {
        return service.getInventoryMetrics();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories(){
        List<String> categories = service.getAllProducts()
            .stream()
            .map(Product::getCategory)
            .distinct()
            .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
    
}