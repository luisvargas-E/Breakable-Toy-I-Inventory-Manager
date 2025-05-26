import {
  Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button, Flex, Box,
  textDecoration,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
//import api from "../../api/axios";
import type { Product, SortKey, ProductTableProps, SearchFormData}  from "../components.types"
import  Actions  from "../Actions/Actions.components";
import StockToggleButton from "../Items/StockButtom";


const ProductTable = ({filters, products, setProducts, onUpdate, onDelete, categories}: ProductTableProps) => {
  //const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const itemsPerPage = 10;
  

  useEffect(() => {
    const lower = filters.name.toLowerCase();
    const filteredData = products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(lower);
      const matchAvailability =
        filters.availability === "in-stock"
        ? p.quantityInStock > 0
        : filters.availability === "out-of-stock"
        ? p.quantityInStock === 0
        : true;
    const matchCategory =
      filters.categories.length  === 0 || filters.categories.includes(p.category);
    return matchName && matchAvailability && matchCategory;
    });
    setFiltered(filteredData);
    setPage(1);
  }, [filters, products]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filtered, sortKey, sortAsc]);

  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
 const getExpirationBg = (expirationDate?: string): string | undefined => {
  if (!expirationDate) return  undefined;

  const today= new Date();
  const exp = new Date(expirationDate);
  const diffDays = Math.ceil((exp.getTime()  - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return "red.100";
  if (diffDays < 14) return "yellow.100";
  if (diffDays >= 14) return "green.100";

  return undefined;
 };

 const getStockColor= (stock: number): string | undefined => {
  
  if(stock >= 5 && stock <= 10 ) return "orange.300";
  if (stock >= 0 && stock < 5) return "red.700";
  return undefined;
 };

 const getNameStyle = (stock: number) =>
    stock === 0 ? { textDecoration: "line-through" } : {};
  return (
    <Box p={4}>
      <Table variant= "simple">
        <Thead>
          <Tr>
            
            <Th cursor="pointer" onClick={() => toggleSort("category")}>
              Category <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort("name")}>
              Name <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort("unitPrice")}>
              Price <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort("expirationDate")}>
              Expiration Date <ArrowUpDownIcon />
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort("quantityInStock")}>Stock
              <ArrowUpDownIcon />
            </Th>
            <Th>Stock Toggle</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginated.map((p) => (
            <Tr key={p.id} bg={getExpirationBg(p.expirationDate)}>
              <Td>{p.category}</Td>
              <Td sx={getNameStyle(p.quantityInStock)}>{p.name}</Td>
              <Td>${p.unitPrice.toFixed(2)}</Td>
              <Td>{p.expirationDate?.split("T")[0]}</Td>
              <Td color={getStockColor(p.quantityInStock)}>{p.quantityInStock}</Td>
              <Td>
                <StockToggleButton product={p} onStatusChange={(updated) => {
                    setProducts((prev: Product[]) => 
                      prev.map((prod) => (prod.id === updated.id ? updated : prod))
                  );
                }}
                />
              </Td>
              <Td>
                <Actions product={p}  onUpdate={onUpdate} onDelete={onDelete} categories={categories}/>
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
            onClick={() => setPage(i + 1)}
            variant={page === i + 1 ? "solid" : "outline"}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductTable;
