import {
  Group,
  Paper,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { LineChart } from "../components/LineChart";
import { useGetProducts } from "../../src/queries/ProductQueries";
import { CustomNextPage } from "../../src/types/CustomNextPage";

const dashboard: CustomNextPage = () => {
  const {
    data: products,
    isLoading: productsLoading,
    refetch,
    isRefetching: productsRefetching,
  } = useGetProducts({
    take: "3",
    dates: "20",
  });
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <main>
        {/* TITLE */}
        <Group align="center" mb="2rem" mt="1rem">
          <Title size="1.5rem" weight="500">
            Dashboard
          </Title>
        </Group>

        {!productsLoading && products && !productsRefetching && (
          <Paper
            sx={(theme) => ({
              padding: theme.spacing.xl,
            })}
          >
            {products?.map((product) => {
              return <LineChart product={product} colorsScheme={colorScheme} />;
            })}
          </Paper>
        )}
      </main>
    </>
  );
};

dashboard.requireAuth = true;
export default dashboard;
