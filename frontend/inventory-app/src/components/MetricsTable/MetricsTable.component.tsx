
import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Spinner } from "@chakra-ui/react";
import api from "../../api/axios";
import type {  Props, MetricsResponse } from "../MetricsTable/MetricsTable.types";


const MetricsTable = ({  getMetricsProducts }: Props) => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get<MetricsResponse>("/products/metrics");
      setMetrics(res.data);
    } catch (error) {
      console.error("Error fetching metrics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [getMetricsProducts]);

  if (loading) return <Spinner />;

  return (
    <Box mt={10}>
      <Heading size="md" mb={4}>Product Stock Metrics</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Category</Th>
            <Th>Total products in Stock</Th>
            <Th>Total Value in Stock</Th>
            <Th>Average price in Stock</Th>
          </Tr>
        </Thead>
        <Tbody>
          {metrics &&
            Object.entries(metrics.categories).map(([category, data]) => (
              <Tr key={category}>
                <Td>{category}</Td>
                <Td>{data.totalStock}</Td>
                <Td>${data.totalValue.toFixed(2)}</Td>
                <Td>${data.averagePrice.toFixed(2)}</Td>
              </Tr>
            ))}
          {metrics && (
            <Tr fontWeight="bold">
              <Td>Overall</Td>
              <Td>{metrics.overall.totalStock}</Td>
              <Td>${metrics.overall.totalValue.toFixed(2)}</Td>
              <Td>${metrics.overall.averagePrice.toFixed(2)}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MetricsTable;
