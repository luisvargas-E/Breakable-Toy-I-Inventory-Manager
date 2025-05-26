import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  ModalBody,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import { Controller  } from 'react-hook-form';
import type {FieldErrors, UseFormRegister, Control} from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';

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
  return (
    <>
      <ModalBody>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input {...register('name', { required: true, maxLength: 120 })} />
          </FormControl>

          <FormControl>
            <FormLabel>Category</FormLabel>
            <input
              placeholder='Type or Select Category'
              list='category-options'
              {...register("category", { required: true })}
            />
            <datalist id="category-options">
              {Array.isArray(categories) &&categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && <Text color="red.500">Category is required</Text>}
 
          </FormControl>

          <FormControl>
            <FormLabel>Stock</FormLabel>
            <Input type="number" {...register('quantityInStock', { required: true , min:0, valueAsNumber: true,})} />
          </FormControl>

          <FormControl>
            <FormLabel>Unit Price</FormLabel>
            <Input type="number" step="0.01" {...register('unitPrice', { required: true })} />
          </FormControl>

          <FormControl>
            <FormLabel>Expiration Date (Optional)</FormLabel>
           <Controller
              name="expirationDate"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="date"
                  value={field.value || ""}
                  onChange={field.onChange}
                  />
              )}
            />

          
          </FormControl>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button type="submit" colorScheme="green" mr={3} isLoading={isSubmitting}>
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ModalFooter>
    </>
  );
};

export default CreateProductForm;