import type { Product }  from "../ProductTable/ProductTable.types";
export type StockProps ={
    product: Product;
    onStatusChange: (updated: Product) => void;
};