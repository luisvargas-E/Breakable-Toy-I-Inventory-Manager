import { Button, ChakraProvider, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {  AddIcon } from '@chakra-ui/icons';

import { SearchForm } from "./components/SearchForm";
import CreateProduct from "./components/CreateProduct"  
import  ProductTable  from "./components/ProductTable";
import MetricsTable from "./components/MetricsTable.tsx/MetricsTable.component";
import type { SearchFormData,  Product,  } from "./components/components.types";
import api from "./api/axios";

function App() {

  const {  isOpen, onOpen, onClose } = useDisclosure();

  const [filters, setFilters] =  useState({
    name: "",
    availability: "",
    categories: [] as string[],
  });

  const [categories, setCategories]= useState<string[]>([]);
//Fetch the products in the inventory
useEffect(() => {
  const  fetchProducts =  async () => {
    try{
      const res = await api.get("/products");
      setProducts(res.data);
    } catch(error) {
      console.error("Error  fetching products:", error);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await api.get("http://localhost:9090/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fecth categories:', error);
    }
  };
  
  fetchProducts();
  fetchCategories();
}, []);
//Refresh Metrics
  const [metricsRefresh, setMetricsRefresh] = useState(Date.now());

  const triggerMetricsRefresh = () => {
    setMetricsRefresh(Date.now());
  };
//Recover date from  the Search Form
  const handleSearch = (data: SearchFormData) => {
    console.log("search filters:",data);
    setFilters(data);
  };
//Recover Data from the api and created products
  const [products, setProducts] = useState<Product[]>([]);
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev=> [...prev, newProduct]);
    if (!categories.includes(newProduct.category)) {
      setCategories((prev) => [...prev, newProduct.category]);
    }
    triggerMetricsRefresh();
  };
  //Botones stock
  const handleUpdateProduct =(updatedProduct: Product) => {
    setProducts((prev) =>
    prev.map((p) => (p.id === updatedProduct.id ? updatedProduct :p))
  );
  triggerMetricsRefresh();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    triggerMetricsRefresh();
  };

  
  return (
    <ChakraProvider>
      <Flex
         height="300" width="1500px" direction="column" m="10" p="6" borderWidth="1px" borderRadius="md"
         >
          <SearchForm onSearch={handleSearch} onOpenModal={onOpen} categories={categories}/>
          <Button  alignSelf="center" onClick={onOpen}  colorScheme="green" width="230px">
            <AddIcon w={5} h={5} m={4}/>Create New Product
          </Button>
          <CreateProduct isOpen={isOpen} onClose={onClose} onAddProduct={handleAddProduct} categories={categories}/>
         </Flex>  
         <Flex height="800" width="1500px" direction="column" m="10" p="6" borderWidth="1px" borderRadius="md"
         >
          <ProductTable  
          filters={filters}
          products={products}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          setProducts={setProducts}
          categories={categories}/>
          </Flex> 
      <Flex 
        height="600" width="1500px" direction="column" m="10" p="6" borderWidth="1px" borderRadius="md"
         >
          <MetricsTable refreshTrigger={metricsRefresh} />
          </Flex>      
    </ChakraProvider>
  );
}

export default App;