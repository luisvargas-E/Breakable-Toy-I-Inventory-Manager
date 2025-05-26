package com.luisv.inventory.inventory_api.service;

import org.springframework.stereotype.Service;

import com.luisv.inventory.inventory_api.model.Product;
import com.luisv.inventory.inventory_api.repository.ProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return repo.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        product.setUpdatedAt(LocalDateTime.now());
        return repo.update(id, product);
    }

    public void deleteProduct(Long id) {
        repo.delete(id);
    }

    public Product markOutOfStock(Long id) {
        Product product = repo.findById(id).orElseThrow();
        product.setQuantityInStock(0);
        product.setUpdatedAt(LocalDateTime.now());
        return repo.update(id, product);
    }

    public Product markInStock(Long id) {
        Product product = repo.findById(id).orElseThrow();
        product.setQuantityInStock(10);
        product.setUpdatedAt(LocalDateTime.now());
        return repo.update(id, product);
    }

    public List<Product> search(String name, List<String> categories, Boolean inStock,
                                String sortBy, int page, int size) {
        Stream<Product> stream = repo.findAll().stream();

        if (name != null && !name.isEmpty()) {
            stream = stream.filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()));
        }

        if (categories != null && !categories.isEmpty()) {
            stream = stream.filter(p -> categories.contains(p.getCategory()));
        }

        if (inStock != null) {
            stream = stream.filter(p -> inStock ? p.getQuantityInStock() > 0 : p.getQuantityInStock() == 0);
        }

        if (sortBy != null) {
            String[] sorts = sortBy.split(";");
            for (String sort : sorts) {
                String[] parts = sort.split(",");
                String field = parts[0];
                String direction = parts.length > 1 ? parts[1] : "asc";
                Comparator<Product> comparator = getComparator(field, direction);
                stream = stream.sorted(comparator);
            }
        }

        return stream.skip((long) page * size).limit(size).collect(Collectors.toList());
    }

    private Comparator<Product> getComparator(String field, String direction) {
        Comparator<Product> comparator = switch (field) {
            case "name" -> Comparator.comparing(Product::getName);
            case "category" -> Comparator.comparing(Product::getCategory);
            case "price" -> Comparator.comparing(Product::getUnitPrice);
            case "stock" -> Comparator.comparing(Product::getQuantityInStock);
            case "expirationDate" -> Comparator.comparing(
                    p -> Optional.ofNullable(p.getExpirationDate()).orElse(LocalDate.MAX));
            default -> Comparator.comparing(Product::getId);
        };
        return "desc".equals(direction) ? comparator.reversed() : comparator;
    }

    public Map<String, Object> getInventoryMetrics() {
        List<Product> all = repo.findAll();
        // Group Category
        Map<String, List<Product>> grouped = all.stream()
            .collect(Collectors.groupingBy(Product::getCategory));

        //Category Metrics
        Map<String, Map<String, Object>> categoryMetrics = new HashMap<>();

        for  (String category : grouped.keySet()){
            List<Product> products = grouped.get(category);
            List<Product> inStock = products.stream()
                .filter(p -> p.getQuantityInStock() >0)
                .toList();
            
            int totalStock = inStock.stream()
                .mapToInt(Product::getQuantityInStock)
                .sum();
            double totalValue = inStock.stream()
                .mapToDouble(p -> p.getQuantityInStock() * p.getUnitPrice())
                .sum();
            double averagePrice = totalStock > 0 ? totalValue / totalStock : 0;

            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalStock", totalStock);
            metrics.put("totalValue", totalValue);
            metrics.put("averagePrice", averagePrice);

            categoryMetrics.put(category, metrics);
        }

        int overallStock = categoryMetrics.values().stream()
            .mapToInt(m -> (int) m.get("totalStock"))
            .sum();
        
        double overallValue = categoryMetrics.values().stream()
            .mapToDouble(m -> (double) m.get("totalValue"))
            .sum();

        double overallAverage = overallStock > 0 ? overallValue / overallStock : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categoryMetrics);
        result.put("overall", Map.of(
            "totalStock", overallStock,
            "totalValue", overallValue,
            "averagePrice", overallAverage
        ));
        /*List<Product> inStock = all.stream().filter(p -> p.getQuantityInStock() > 0).toList();

        double totalValue = inStock.stream().mapToDouble(p -> p.getQuantityInStock() * p.getUnitPrice()).sum();
        double avgPrice = inStock.stream().mapToDouble(Product::getUnitPrice).average().orElse(0);
        int totalQty = inStock.stream().mapToInt(Product::getQuantityInStock).sum();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalStock", totalQty);
        metrics.put("totalValue", totalValue);
        metrics.put("averagePrice", avgPrice);
        return metrics;*/
        return result;
    }
}
