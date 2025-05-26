export type SearchFormData = {
    name: string;
    availability: string;
    categories: string [];
};

export type SearchFormProps = {
    onSearch: (data: SearchFormData) => void;
    onOpenModal: () => void;
    categories: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  quantityInStock: number;
  unitPrice: number;
  expirationDate: string;
};

export type Actions = {
  onUpdate: (product: Product) => void;
  onDelete: (id:string) => void;
}

export type SortKey = "name" | "category" | "unitPrice" | "expirationDate" | "quantityInStock";

export type ProductTableProps = Actions & {
  filters: SearchFormData;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
};

export type StockProps ={
    product: Product;
    onStatusChange: (updated: Product) => void;
};