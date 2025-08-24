import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  ModalBody,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';

export type CreateProductFormData = {
  name: string;
  category: string;
  quantityInStock: number;
  unitPrice: number;
  expirationDate: string;
};

type Props = {
  register: UseFormRegister<CreateProductFormData>;
  errors: FieldErrors<CreateProductFormData>;
  isSubmitting: boolean;
  onCancel: () => void;
  control: Control<CreateProductFormData>;
  categories: string[];
};

export const CreateProductForm = ({
  register,
  errors,
  isSubmitting,
  onCancel,
  control,
  categories,
}: Props) => {

  const renderCategoryInput = () => (
    <FormControl isInvalid={!!errors.category}>
      <FormLabel>Category</FormLabel>
      <Input
        placeholder="Type or Select Category"
        list="category-options"
        {...register('category', { required: 'Category is required' })}
      />
      <datalist id="category-options">
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      {errors.category && (
        <Text color="red.500">{errors.category.message}</Text>
      )}
    </FormControl>
  );

  return (
    <>
      <ModalBody>
        <Stack spacing={4}>
          {/* Product Name */}
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 120, message: 'Max 120 characters' },
              })}
            />
            {errors.name && <Text color="red.500">{errors.name.message}</Text>}
          </FormControl>

          {/* Category */}
          {renderCategoryInput()}

          {/* Quantity in Stock */}
          <FormControl isInvalid={!!errors.quantityInStock}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              min={0}
              {...register('quantityInStock', {
                required: 'Stock is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Stock cannot be negative' },
              })}
            />
            {errors.quantityInStock && (
              <Text color="red.500">{errors.quantityInStock.message}</Text>
            )}
          </FormControl>

          {/* Unit Price */}
          <FormControl isInvalid={!!errors.unitPrice}>
            <FormLabel>Unit Price</FormLabel>
            <Input
              type="number"
              step="0.01"
              {...register('unitPrice', { required: 'Unit Price is required' })}
            />
            {errors.unitPrice && (
              <Text color="red.500">{errors.unitPrice.message}</Text>
            )}
          </FormControl>

          {/* Expiration Date (Optional) */}
          <FormControl>
            <FormLabel>Expiration Date (Optional)</FormLabel>
            <Controller
              name="expirationDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button
          type="submit"
          colorScheme="green"
          mr={3}
          isLoading={isSubmitting}
        >
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ModalFooter>
    </>
  );
};

export default CreateProductForm;
