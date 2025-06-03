import { 
  Flex, Input, Select, Button, FormControl, FormLabel, Stack, Checkbox, InputGroup, InputLeftElement} from "@chakra-ui/react";
import {  useForm } from "react-hook-form";
import { Search2Icon } from "@chakra-ui/icons";
import type { SearchFormProps, SearchFormData } from "./SearchForm.types";

export const SearchForm = ({ onSearch, categories }:SearchFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
      }  = useForm<SearchFormData>({
        defaultValues: {
          name: "",
          availability: "",
          categories: [],
        },
      });

      const selectedCategories = watch('categories') || [];

      const handleAllToggle = (checked: boolean) => {
        if (checked) {
          setValue('categories', [...categories]);
        } else {
          setValue('categories', []);
        }
      }; 

      const handleReset = () => {
        reset();
      };

      return (
        <form onSubmit={handleSubmit(onSearch)}>
            <Stack spacing={4}>
              <FormControl>
                <InputGroup>
                <InputLeftElement
                children={<Search2Icon/>}
                />
                <Input
                  placeholder="Enter Product name"
                  {...register('name')}
                  />
                </InputGroup>
                  {errors.name  &&  <span>Name is required</span>}
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Select Product availability"
                  {...register('availability')}
                >
                    <option value="in-stock">In stock</option>
                    <option value="out-of-stock">Out of stock</option> 
                  </Select>
                  {errors.availability && (
                    <span>Availability is required</span>
                  )}
              </FormControl>
              <FormControl>
                <FormLabel>Select Categories</FormLabel>
                <Stack spacing={2} direction="row">
                    {Array.isArray(categories) && categories.map((cat) => (
                      <Checkbox
                        key={cat}
                        value={cat}
                        {...register('categories')}
                        isChecked={selectedCategories.includes(cat)}
                        onChange={(e)=> {
                          const current = selectedCategories;
                          const updated = e.target.checked
                            ? [...current, cat]
                            : current.filter((c: string) => c !== cat);
                          setValue('categories',updated);
                        }}
                        sx={{
                          "& .chakra-checkbox__control": {
                            borderRadius: "full",

                          },
                        }}
                      >
                        {cat}
                      </Checkbox>
                    ))}
                  </Stack>
              </FormControl>

              <Flex gap={4}>
              <Button type="submit" colorScheme="blue" width="fit-content">
                Search
              </Button>
              <Button onClick={handleReset} variant="outline" colorScheme="gray">
                Reset
              </Button>
              </Flex>
            </Stack>
          </form>
  );
};
export default SearchForm;