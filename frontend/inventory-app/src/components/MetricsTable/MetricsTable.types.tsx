export type CategoryMetrics = {
  totalStock: number;
  totalValue: number;
  averagePrice: number;
};

export type MetricsResponse = {
  overall: CategoryMetrics;
  categories: Record<string, CategoryMetrics>;
};

export type Props = {
    getMetricsProducts: number;
};