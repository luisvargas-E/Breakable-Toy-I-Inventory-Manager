import {
  Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Box,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import type { Product, SortKey, ProductTableProps } from "../ProductTable/ProductTable.types";
import Actions from "../Actions/Actions.components";
import StockToggleButton from "../Items/StockButtom";

const ProductTable = ({
  filters,
  products,
  setProducts,
  onUpdate,
  onDelete,
  categories,
  getMetricsRefresh,
}: ProductTableProps) => {

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [isAscending, setIsAscending] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Filtrar productos según nombre, categoría y disponibilidad
  useEffect(() => {
    const filtered = products.filter((product) => {
      const nameMatches = product.name.toLowerCase().includes(filters.name.toLowerCase());
      const availabilityMatches =
        filters.availability === "in-stock"
          ? product.quantityInStock > 0
          : filters.availability === "out-of-stock"
          ? product.quantityInStock === 0
          : true;
      const categoryMatches =
        filters.categories.length === 0 || filters.categories.includes(product.category);

      return nameMatches && availabilityMatches && categoryMatches;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, products]);

  // Ordenar productos según la columna y dirección
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return isAscending ? valueA - valueB : valueB - valueA;
      }
      return isAscending
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredProducts, sortKey, isAscending]);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) setIsAscending(!isAscending);
    else {
      setSortKey(key);
      setIsAscending(true);
    }
  };

  // Colores de fondo según días para expiración
  const getExpirationColor = (expirationDate?: string) => {
    if (!expirationDate) return undefined;

    const today = new Date();
    const expiration = new Date(expirationDate);
    const daysDiff = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) return "red.100";
    if (daysDiff < 14) return "yellow.100";
    return "green.100";
  };

  // Colores de stock
  const getStockColor = (quantity: number) => {
    if (quantity >= 5 && quantity <= 10) return "orange.300";
    if (quantity >= 0 && quantity < 5) return "red.300";
    return undefined;
  };

  // Estilo para nombres fuera de stock
  const getNameStyle = (quantity: number) =>
    quantity === 0 ? { textDecoration: "line-through" } : {};

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSortToggle("category")}>
              Category <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => handleSortToggle("name")}>
              Name <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => handleSortToggle("unitPrice")}>
              Price <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => handleSortToggle("expirationDate")}>
              Expiration Date <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => handleSortToggle("quantityInStock")}>
              Stock <ArrowUpDownIcon />
            </Th>
            <Th>Stock Toggle</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedProducts.map((product) => (
            <Tr key={product.id} bg={getExpirationColor(product.expirationDate)}>
              <Td>{product.category}</Td>
              <Td sx={getNameStyle(product.quantityInStock)}>{product.name}</Td>
              <Td>${product.unitPrice.toFixed(2)}</Td>
              <Td>{product.expirationDate?.split("T")[0]}</Td>
              <Td bg={getStockColor(product.quantityInStock)}>{product.quantityInStock}</Td>
              <Td>
                <StockToggleButton
                  product={product}
                  onStatusChange={(updated) => {
                    setProducts((prev) =>
                      prev.map((p) => (p.id === updated.id ? updated : p))
                    );
                    getMetricsRefresh();
                  }}
                />
              </Td>
              <Td>
                <Actions
                  product={product}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  categories={categories}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex mt={4} justify="center" gap={2}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            size="sm"
            onClick={() => setCurrentPage(i + 1)}
            variant={currentPage === i + 1 ? "solid" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductTable;
