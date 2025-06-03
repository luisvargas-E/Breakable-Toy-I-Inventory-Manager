import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import ProductTable from "../ProductTable/ProductTable.component";
import type { ProductTableProps } from "../ProductTable/ProductTable.types";
import { vi,describe, it, expect } from "vitest";

vi.mock("../Items/StockButtom", () => ({
  __esModule: true,
  default: ({onStatusChange}: any) => (
    <button onClick={() => onStatusChange({ id: 1})}>
      Mock Toggle
    </button>
  ),
}));

const mockProps: ProductTableProps = {
  filters: { name: "", availability: "", categories: [] },
  products: [
    {
      id: "1",
      name: "Test Product",
      unitPrice: 9.99,
      expirationDate: "2025-12-31",
      quantityInStock: 10,
      category: "Test Category",
    },
  ],
  setProducts: vi.fn(),
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
  categories: ["Test Category"],
  getMetricsRefresh: vi.fn(),
};

describe("ProductTable Component", () => {
  it("renders product name and category", () => {
    render(
      <ChakraProvider>
        <ProductTable {...mockProps} />
      </ChakraProvider>
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
  });

  it("calls setProducts when stock toggle is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChakraProvider>
        <ProductTable {...mockProps} />
      </ChakraProvider>
    );

    const toggleButton = screen.getByText("Mock Toggle");
    await user.click(toggleButton);

    expect(mockProps.setProducts).toHaveBeenCalled();
  });
});
