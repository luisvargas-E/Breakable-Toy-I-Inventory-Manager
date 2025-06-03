# 🛠️Breakable Toy I: Inventory Manager 

## Overview
Simple Inventory Management APP to manage inventories.
Built with **React + TypeScript** (frontend) and **Spring Boot + Java** (backend).

## API Endpoints

```http
GET /products -List all products 
POST /products -Create a new product 
PUT /products/{id} -Update a product 
PUT /products/{id}/outofstock -Mark as out of stock 
PUT /products/{id}/instock -Restore as in stock 
GET /products/search -Search with filters (name, category, stock status) 
GET /products/metrics -Get product-releated metrics 
GET /categories - List all categories 
```

## Runing Application
Install inventory-app with npm and mvn
### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run # Runs the backend on http://localhost:9090
mvn test # Runs backend tests
```
### Frontend

```bash
cd frontend
npm install
npm run start # Runs the app on http://localhost:8080
npm run tests # Runs tests
```