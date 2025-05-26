import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CreateProductForm  } from './CreateProductForm';
import api from '../../api/axios';
import type {Product } from "../components.types"

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  categories: string[];
};

type CreateProductFormData = {
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: string;
  quantityInStock: number;
}

const CreateProduct = ({ isOpen, onClose, onAddProduct, categories }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductFormData>();

  const toast = useToast();

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      const product = {
        //id: uuidv4(),
        name: data.name,
        category: data.category,
        quantityInStock: data.quantityInStock,
        unitPrice: data.unitPrice,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate).toISOString()
          : null,
        //expirationDate: new Date(data.expirationDate).toISOString(),
        creationDate: new Date().toISOString(),
      };

      const response = await api.post("/products", product);
      onAddProduct(response.data);

      toast({
        title: "Product created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Failed to create product",
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
        <ModalHeader> Create Product</ModalHeader>
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

export default CreateProduct;