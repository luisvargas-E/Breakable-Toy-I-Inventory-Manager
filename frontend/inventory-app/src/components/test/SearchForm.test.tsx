import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm/SearchForm.component';
import { describe, it, expect, vi, beforeEach } from 'vitest';


describe('SearchForm', () => {
  const mockOnSearch = vi.fn();
  const categories = ['Books', 'Electronics', 'Clothing'];

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders all form elements', () => {
    render(<SearchForm onSearch={mockOnSearch} categories={categories} onOpenModal={() => {}} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    categories.forEach((cat) => {
      expect(screen.getByLabelText(cat)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });


  it('resets the form when clicking Reset button', () => {
    render(<SearchForm onSearch={mockOnSearch} categories={categories} onOpenModal={() => {}} />);

    const nameInput = screen.getByPlaceholderText(/Enter Product name/i);
    const availabilitySelect = screen.getByRole('combobox');
    const booksCheckbox = screen.getByLabelText('Books');

    fireEvent.change(nameInput, { target: { value: 'Phone' } });
    fireEvent.change(availabilitySelect, { target: { value: 'out-of-stock' } });
    fireEvent.click(booksCheckbox);

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect((nameInput as HTMLInputElement).value).toBe('');
    expect((availabilitySelect as HTMLSelectElement).value).toBe('');
    expect((booksCheckbox as HTMLInputElement).checked).toBe(false);
  });
});
