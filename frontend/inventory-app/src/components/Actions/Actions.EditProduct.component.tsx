import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import api from "../../api/axios";
import type  { CreateProductFormData } from "../CreateProduct/CreateProductForm";
import CreateProductForm from "../CreateProduct/CreateProductForm"
import type { Product } from "../components.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onUpdate: (updated: Product) => void;
  categories: string[];
};

const EditProductModal = ({ isOpen, onClose, product, onUpdate, categories }: Props) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormData>();

  

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        category: product.category,
        quantityInStock: product.quantityInStock,
        unitPrice: product.unitPrice,
        expirationDate: product.expirationDate?.split("T")[0] || "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      const updatedProduct: Product = {
        ...product,
        name: data.name,
        category: data.category,
        quantityInStock: data.quantityInStock,
        unitPrice: data.unitPrice,
        expirationDate: new Date(data.expirationDate).toISOString(),
      };

      const response = await api.put(`/products/${product.id}`, updatedProduct);
      onUpdate(response.data);
      toast({
        title: "Product updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating product", error);
      toast({
        title: "Failed to update product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <CreateProductForm
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          control={control}
          categories={categories}
        />
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;