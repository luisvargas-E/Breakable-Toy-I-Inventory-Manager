import { Button, useToast} from "@chakra-ui/react";
import api from "../../api/axios";
import type { Product} from "../ProductTable/ProductTable.types";

export type StockProps ={
    product: Product;
    onStatusChange: (updated: Product) => void;
};

const StockToggleButton = ({product, onStatusChange }: StockProps) => {
    const toast =useToast();

    const handleToggle = async () => {
        try {
          let updatedProduct;

          if (product.quantityInStock > 0)  {
            await api.post(`products/${product.id}/outofstock`);
            updatedProduct = {...product, quantityInStock: 0};
            toast({title: "Marked as out of  stock",status: "info"});
          } else {
            await api.put(`/products/${product.id}/instock`);
            updatedProduct = {...product, quantityInStock: 10};
            toast({title: "Restored to in stock",status: "success"});
            
        }
         onStatusChange(updatedProduct);  
        } catch (error) {
            toast({title: "Error updating stock", status: "error"});
            console.error(error);
        }
    };

    return (
        <Button size="sm" colorScheme={product.quantityInStock > 0 ? "red" : "green"}
        onClick={handleToggle}
        >
            {product.quantityInStock > 0 ? "Mark as Out of Stock" : "Mark as In Stock"}
        </Button> 
    );
};

export default StockToggleButton;