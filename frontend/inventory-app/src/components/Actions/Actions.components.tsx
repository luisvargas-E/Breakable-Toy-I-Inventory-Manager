import { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import EditProductModal from "../Actions/Actions.EditProduct.component";
import ConfirmDeleteModal from "../Actions/Actions.ConfirmDelete";
import type { Product } from "../components.types";
import api from "../../api/axios";

type ActionsProps = {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  categories: string[];
};

const Actions = ({ product, onUpdate, onDelete, categories }: ActionsProps) => {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${product.id}`);
      onDelete(product.id);
      toast({
        title: "Product deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting product", error);
      toast({
        title: "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button size="sm" mr={2} colorScheme="blue" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <Button size="sm" colorScheme="red" onClick={() => setDeleteOpen(true)}>
        Delete
      </Button>

      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        onUpdate={onUpdate}
        categories={categories}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async() => {
          await handleDelete();
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default Actions;