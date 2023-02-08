import React, { useEffect, useState } from "react";
import { CustomNextPage } from "../../src/types/CustomNextPage";
import {
  Group,
  ThemeIcon,
  Title,
  Grid,
  Text,
  Col,
  Paper,
  Stack,
  Autocomplete,
  Select,
  Button,
  Modal,
  NumberInput,
  LoadingOverlay,
  Box,
  Skeleton,
  Card,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { BsBox } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useGetProducts } from "../../src/queries/ProductQueries";
import { type ProductsWithDate } from "../../src/types/getProducts";
import { postDateSchema } from "../../src/types/postDate";
import { deleteDateSchema } from "../../src/types/deleteDate";
import { usePostDate, useDeleteDate } from "../../src/queries/DateQueries";
import { queryClient } from "./_app";
import Link from "next/link";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";

const inventory: CustomNextPage = () => {
  const { data: products, isLoading: productsLoading } = useGetProducts({
    take: "20",
    dates: "50",
  });
  const [autoCompleteOption, setAutoCompleteOptions] = useState<
    ProductsWithDate["name"][]
  >([]);
  const [autoCompleteValue, setAutoCompleteValue] =
    useState<ProductsWithDate["name"]>();
  const [filteredProducts, setFilteredProducts] = useState<
    ProductsWithDate[] | undefined
  >([]);
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "quantity" | null | string
  >("name");

  // SET SELECT DATA FPOR SEARCH
  useEffect(() => {
    setAutoCompleteOptions([]);
    if (products) {
      products.map((prod) =>
        setAutoCompleteOptions((selectData) => [...selectData, prod.name])
      );
    }
    setFilteredProducts(products);
  }, [products]);

  // FILTER PRODUCT BY NAME
  useEffect(() => {
    if (autoCompleteValue && products) {
      setFilteredProducts((products) =>
        products?.filter((prod) =>
          prod.name.toLowerCase().includes(autoCompleteValue.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [autoCompleteValue, sortBy]);

  // MODAL STATE
  const [changeCurrentInventoryModal, setChangeCurrentInventoryModal] =
    useState(false);
  const [inventoryChangesModal, setInventoryChangesModal] = useState(false);

  // FORM OF MODAL
  const patchInventoryForm = useForm({
    validate: zodResolver(postDateSchema),
    initialValues: {
      productId: "",
      date: new Date(),
      stock: 0,
      totalPrice: [0],
    },
  });

  const deleteInventoryForm = useForm({
    validate: zodResolver(deleteDateSchema),
    initialValues: {
      productId: "",
      id: "",
    },
  });

  // POST DATE HOOK
  const { mutate: PostDate, isLoading: PostDateLoading } = usePostDate();
  const { mutate: DeleteDate, isLoading: DeleteDateLoading } = useDeleteDate();

  // DATES OF PRODUCTS WITH DATE
  const [selectedProduct, setSelectedProduct] = useState<ProductsWithDate>();

  return (
    <main>
      {/* TITLE */}
      <Group align="center" mb="2rem" mt="1rem">
        <Title size="1.5rem" weight="500">
          Inventory
        </Title>
      </Group>
      {/* SEARCH BAR */}
      <Group align="center" mb="1.5rem">
        <Autocomplete
          data={autoCompleteOption}
          value={autoCompleteValue}
          onChange={setAutoCompleteValue}
          placeholder="Search by Product Name..."
          nothingFound="No Products Found"
          icon={<FiSearch />}
          transition="pop-top-left"
          transitionDuration={80}
          transitionTimingFunction="easeInOut"
          sx={{ maxWidth: "600px", width: "100%" }}
        />
        <Select
          data={[
            { value: "name", label: "Name" },
            { value: "price", label: "Price" },
            { value: "quantity", label: "Quantity" },
          ]}
          value={sortBy}
          onChange={setSortBy}
          placeholder="Sort By..."
          sx={{ maxWidth: "200px", width: "100%" }}
        />
      </Group>
      <Paper shadow="sm" p="lg">
        {/* NO INVENTORY */}
        {products?.length === 0 && !productsLoading && (
          <Box>
            <Group position="center" py="lg">
              <Text size="lg">No Inventory</Text>
              <BsBox size={20} />
            </Group>
          </Box>
        )}
        {/* PRODUCTS */}
        <Skeleton
          visible={productsLoading}
          sx={{ minHeight: products?.length === 0 ? "0px" : "0px" }}
          animate
        >
          <Grid grow gutter="sm" sx={{ height: "100%" }}>
            {filteredProducts?.map((product) => {
              return (
                <Col
                  span={3}
                  order={2}
                  orderSm={1}
                  orderLg={3}
                  key={product.id}
                  sx={{
                    minWidth: "340px",
                    "@media (max-width: 350px)": {
                      minWidth: "100%",
                    },
                  }}
                >
                  <Card
                    p="xl"
                    shadow="lg"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Title order={3}>{product.name}</Title>
                    <Title
                      order={5}
                      weight="400"
                      mb={"sm"}
                      color="gray"
                      variant="text"
                      sx={(theme) => ({
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[0]
                            : theme.colors.gray[6],
                      })}
                    >
                      {product.category.name}
                    </Title>
                    <Text
                      sx={(theme) => ({
                        color:
                          theme.colorScheme === "dark"
                            ? theme.colors.dark[1]
                            : theme.colors.gray[9],
                      })}
                      mt={"sm"}
                      mb={"sm"}
                    >
                      {product.description}
                    </Text>
                    <Group
                      spacing="md"
                      noWrap
                      mb="1.5rem"
                      sx={{ height: "100%" }}
                    >
                      <Stack sx={{ width: "100%", alignSelf: "flex-end" }}>
                        <Text>Price per unit</Text>
                        <Text>MYR {product.price}</Text>
                      </Stack>
                      <Stack sx={{ width: "100%", alignSelf: "flex-end" }}>
                        <Text>Current Stock</Text>
                        <Text>
                          {product?.date[0] ? product?.date[0]?.stock : 0}
                        </Text>
                      </Stack>
                    </Group>
                    <Group>
                      <Button
                        onClick={() => {
                          patchInventoryForm.setFieldValue(
                            "productId",
                            product.id
                          );
                          patchInventoryForm.setFieldValue(
                            "stock",
                            product.date[0]?.stock
                          );
                          setChangeCurrentInventoryModal(true);
                        }}
                      >
                        Change Current Inventory
                      </Button>
                      <Button
                        color="violet"
                        onClick={() => {
                          setInventoryChangesModal(true);
                          setSelectedProduct(product);
                          deleteInventoryForm.setFieldValue(
                            "productId",
                            product.id
                          );
                          deleteInventoryForm.setFieldValue(
                            "id",
                            product.date[0]?.id
                          );
                        }}
                      >
                        Inventory History
                      </Button>
                    </Group>
                  </Card>
                </Col>
              );
            })}
          </Grid>
        </Skeleton>
      </Paper>
      {/* ACTIONS FOR CREATING A PRODUCTS */}
      <Box>
        <Link passHref href="/products">
          <Button component="a" mt="3rem" variant="outline">
            Create A Product
          </Button>
        </Link>
      </Box>
      {/* MODAL */}
      <Modal
        opened={changeCurrentInventoryModal}
        onClose={() => setChangeCurrentInventoryModal(false)}
        title="Inventory Update Modal"
        centered
      >
        <form
          onSubmit={patchInventoryForm.onSubmit(() => {
            PostDate(
              {
                productId: patchInventoryForm.values.productId,
                date: patchInventoryForm.values.date,
                stock: patchInventoryForm.values.stock,
                totalPrice: patchInventoryForm.values.totalPrice,
              },
              {
                onSuccess: () => {
                  setChangeCurrentInventoryModal(false);
                  queryClient.refetchQueries(["products"]);
                },
              }
            );
          })}
        >
          <LoadingOverlay
            visible={PostDateLoading ?? false}
            transitionDuration={500}
          />
          <NumberInput
            placeholder="Stock Number"
            label="Stock"
            withAsterisk
            mb="1rem"
            {...patchInventoryForm.getInputProps("stock")}
          />
          <DatePicker
            placeholder="Pick date"
            label="Event date"
            labelFormat="MM/YYYY"
            mb="1rem"
            maxDate={new Date()}
            {...patchInventoryForm.getInputProps("date")}
          />
          <Group noWrap={false}>
            <Button type="submit">Update Inventory</Button>
            <Button
              color="red"
              onClick={() => {
                setChangeCurrentInventoryModal(false);
                // try {
                //   prisma.date.update({
                //     where: {

                //     },
                //     data: {
                //       totalPrice: filteredProducts.map(
                //         (product) => product.price * product?.date[0]?.stock
                //       ),
                //     },
                //   });
                // } catch (error) {}
              }}
            >
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
      {/* INVENTORY DELETE CHANGES MODAL */}
      <Modal
        opened={inventoryChangesModal}
        onClose={() => setInventoryChangesModal(false)}
        title={`Latest ${selectedProduct?.date.length} Changes`}
        centered
        overflow="inside"
      >
        <Stack>
          {selectedProduct?.date.map((date) => {
            return (
              <form
                onSubmit={deleteInventoryForm.onSubmit((values) =>
                  DeleteDate(
                    {
                      id: date.id,
                      productId: values.productId,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries(["products"]);
                        setInventoryChangesModal(false);
                      },
                    }
                  )
                )}
                key={date.id}
              >
                <LoadingOverlay
                  visible={DeleteDateLoading}
                  transitionDuration={300}
                />
                <Stack
                  spacing="xs"
                  pb="md"
                  sx={(theme) => ({
                    borderBottom:
                      theme.colorScheme === "dark"
                        ? `1px solid ${theme.colors.dark[2]}`
                        : `1px solid ${theme.colors.gray[9]}`,
                  })}
                >
                  <Group>
                    <Text size="md">
                      Date: {DateTime.fromISO(date?.date as any).toISODate()}
                    </Text>
                    <Text size="md" weight="600">
                      Stock: {date.stock}
                    </Text>
                  </Group>
                  <Button
                    color="red"
                    type={"submit"}
                    sx={{ width: "min-content" }}
                  >
                    Delete
                  </Button>
                </Stack>
              </form>
            );
          })}
          {selectedProduct?.date.length === 0 && (
            <Text>No inventory changes found</Text>
          )}
        </Stack>
      </Modal>
    </main>
  );
};

inventory.requireAuth = true;
export default inventory;
