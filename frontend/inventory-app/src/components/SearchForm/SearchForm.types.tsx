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