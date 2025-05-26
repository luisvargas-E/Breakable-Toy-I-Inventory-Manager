package com.luisv.inventory.inventory_api.repository;


import org.springframework.stereotype.Repository;

import com.luisv.inventory.inventory_api.model.Product;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ProductRepository {
    private final Map<Long, Product> productMap = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong();

    public List<Product> findAll() {
        return new ArrayList<>(productMap.values());
    }

    public Optional<Product> findById(Long id) {
        return Optional.ofNullable(productMap.get(id));
    }

    public Product save(Product product) {
        long id = idGenerator.incrementAndGet();
        product.setId(id);
        productMap.put(id, product);
        return product;
    }

    public Product update(Long id, Product product) {
        product.setId(id);
        productMap.put(id, product);
        return product;
    }

    public void delete(Long id) {
        productMap.remove(id);
    }
}
