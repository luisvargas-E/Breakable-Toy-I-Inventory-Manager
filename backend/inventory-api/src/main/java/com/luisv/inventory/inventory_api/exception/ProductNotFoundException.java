package com.luisv.inventory.inventory_api.exception;

public class ProductNotFoundException  extends RuntimeException {
    public ProductNotFoundException(Long id)
    {
        super("Product With ID" + id + "Not Found");
    }
    
}
