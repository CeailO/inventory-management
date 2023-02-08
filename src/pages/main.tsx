import {
  Box,
  Group,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import React from "react";
import { useGetProducts } from "../../src/queries/ProductQueries";
import { CustomNextPage } from "../../src/types/CustomNextPage";
import { LineChart } from "../components/LineChart";

const Main: CustomNextPage = () => {
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
    <main>
      {/* TITLE */}
      <Group align="center" mb={"3rem"}>
        <Title size="1.5rem" weight="500">
          Latest Updated Products
        </Title>
      </Group>

      {!productsLoading && products && !productsRefetching && (
        <Box
          sx={{
            maxWidth: "90%",
          }}
        >
          {products?.map((product) => {
            return <LineChart product={product} colorsScheme={colorScheme} />;
          })}
        </Box>
      )}
    </main>
  );
};

export default Main;
