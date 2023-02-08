import React, { useEffect, useState } from "react";
import { CustomNextPage } from "../../src/types/CustomNextPage";
import {
  Title,
  Group,
  Button,
  Box,
  Table,
  Select,
  Skeleton,
  Modal,
  TextInput,
  LoadingOverlay,
  Accordion,
  Paper,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { MdWarningAmber } from "react-icons/md";
import {
  useDeleteCategory,
  useGetCategories,
  usePatchCategory,
  usePostCategory,
} from "../../src/queries/CategoryQueries";
import { GetCategory } from "../../src/types/getCategories";
import { postCategorySchema } from "../../src/types/postCategory";
import { queryClient } from "./_app";
import { patchCategorySchema } from "../../src/types/patchCategory";
import { ProductsWithDate } from "../types/getProducts";
import { FiSearch } from "react-icons/fi";

const categories: CustomNextPage = () => {
  // DATES OF PRODUCT AND INVENTORY
  const [selectedProduct, setSelectedProduct] = useState<ProductsWithDate>();

  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  // ACCORDION VALUE & STATE
  const [accordionValue, setAccordionValue] = useState<string | null>(null);
  // SEARCH VALUE & DATA
  const [selectData, setSelectData] = useState<GetCategory["name"][]>([]);
  const [selectValue, setSelectValue] = useState<GetCategory["name"] | null>();
  // FILTER VALUES
  const [FilteredValues, setFilteredValues] = useState<GetCategory[]>();
  // MODAL VALUES & STATE
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [changeModal, setChangeModal] = useState<boolean>(false);
  // SET SELECT DATA FOR SEARCH
  useEffect(() => {
    setSelectData([]);
    if (categories) {
      categories.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.name])
      );
    }
    setFilteredValues(categories);
  }, [categories]);
  // FILTER THE DATA BY THE SELECTED VALUE
  useEffect(() => {
    if (selectValue) {
      setFilteredValues(categories?.filter((ctg) => ctg.name === selectValue));
    } else {
      setFilteredValues(categories);
    }
  }, [selectValue, categories]);
  // SELECT CATEGORY ID
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // VALIDATE POST CATEGORY FORM
  const createCategoryForm = useForm({
    validate: zodResolver(postCategorySchema),
    initialValues: {
      name: "",
    },
  });
  const { mutate: postCategory, isLoading: postCategoryLoading } =
    usePostCategory();
  // VALIDATE DELETE CATEGORY FORM
  const { mutate: deleteCategory, isLoading: deleteCategoryLoading } =
    useDeleteCategory();
  // VALIDATE PATCH CATEGORY FORM
  const patchCategoryForm = useForm({
    validate: zodResolver(patchCategorySchema),
    initialValues: {
      name: "",
      id: "",
    },
  });
  const { mutate: patchCategory, isLoading: patchCategoryLoading } =
    usePatchCategory();
  return (
    <main>
      {/* TITLE */}
      <Group align="center" mb="2rem" mt="1rem">
        <Title size="1.5rem" weight="500">
          Categories
        </Title>
      </Group>
      {/* SELECT COMPONENT */}
      <Select
        data={selectData}
        value={selectValue}
        onChange={setSelectValue}
        placeholder="Search by Category"
        clearable
        searchable
        nothingFound="No Category Found"
        icon={<FiSearch />}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="easeInOut"
        sx={{ maxWidth: "600px", width: "100%" }}
        mb="1.5rem"
      />
      {/* ACCORDION OF THE DATA*/}
      <Paper shadow="sm">
        {/* NO CATEGORIES */}
        {categories?.length === 0 && !categoriesLoading && (
          <Box>
            <Group position="center" py="lg">
              <Text size="lg">No Inventory / Categories</Text>
              <FiSearch size={20} />
            </Group>
          </Box>
        )}
        {/* CATEGORY */}
        <Skeleton
          visible={categoriesLoading ?? false}
          sx={{ minHeight: categories?.length === 0 ? "0px" : "0px" }}
          animate
        >
          <Accordion
            value={accordionValue}
            onChange={setAccordionValue}
            transitionDuration={500}
          >
            {FilteredValues?.map((category: GetCategory, index) => (
              <Accordion.Item
                value={category.name}
                sx={{ overflow: "auto" }}
                key={index}
              >
                <Accordion.Control>{category.name}</Accordion.Control>
                <Accordion.Panel
                  sx={{ width: "max-content", minWidth: "100%" }}
                >
                  <Table striped verticalSpacing="sm" horizontalSpacing="md">
                    <thead>
                      <tr>
                        <th style={{}}>Name</th>
                        <th style={{}}>Price</th>
                        <th style={{}}>Id</th>
                        <th style={{}}>Last Update</th>
                        {/* <th style={{}}>Stock</th> */}
                      </tr>
                    </thead>

                    {category?.products?.map((product) => (
                      <tbody>
                        <tr key={product.name}>
                          <td>
                            {/* NAME */}
                            <div style={{ paddingRight: "1rem" }}>
                              {product.name}
                            </div>
                          </td>
                          <td>
                            {/* PRICE */}
                            <div style={{ paddingRight: "1rem" }}>
                              {`MYR ` + product.price}
                            </div>
                          </td>
                          <td>
                            {/* ID */}
                            <div style={{ paddingRight: "1rem" }}>
                              {product.id}
                            </div>
                          </td>
                          <td>
                            {/* LAST UPDATE */}
                            <div style={{ paddingRight: "1rem" }}>
                              {product.lastUpdate.toString()}
                            </div>
                          </td>
                          <td>
                            {/* LATEST-DATE - STOCK */}
                            {/* <div style={{ paddingRight: "1rem" }}>
                              {product?.date[0] ? product?.date[0]?.stock : "0"}
                            </div> */}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </Table>
                  {/* GROUP OF BUTTON */}
                  <Group>
                    <Button
                      mt="1.5rem"
                      color="blue"
                      onClick={() => {
                        patchCategoryForm.values.name = category.name;
                        setChangeModal(true);
                        setSelectedCategory(category.id);
                      }}
                    >
                      Change Details
                    </Button>
                    <Button
                      mt="1.5rem"
                      color="red"
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedCategory(category.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Skeleton>
      </Paper>
      {/* ACTION FOR CATEGORIES */}
      <Box>
        <Button
          component="a"
          mt="3rem"
          variant="outline"
          onClick={() => setCreateModal(true)}
        >
          Create Category
        </Button>
      </Box>
      {/* MODALS */}
      {/* CREATE CATEGORY */}
      <Modal
        centered
        opened={createModal}
        onClose={() => setCreateModal(false)}
        title="Create Category"
      >
        <form
          onSubmit={createCategoryForm.onSubmit((values) => {
            postCategory(values, {
              onSuccess: () => {
                setCreateModal(false);
                queryClient.refetchQueries(["categories"]);
              },
            });
          })}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={postCategoryLoading ?? false}
          />
          <TextInput
            placeholder="Category Name"
            label="Category Name"
            withAsterisk
            mb="1rem"
            {...createCategoryForm.getInputProps("name")}
          />
          <Group noWrap={false}>
            <Button type="submit">Create Category</Button>
            <Button color="red" onClick={() => setCreateModal(false)}>
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
      {/* DELETE CATEGORY */}
      <Modal
        centered
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Category"
        overflow="inside"
      >
        <LoadingOverlay visible={deleteCategoryLoading ?? false} />
        <Group align="center" mb="1rem">
          <MdWarningAmber size={25} color="#fa5252" />
          <Title color="red" size="md">
            You can't undo this action!
          </Title>
        </Group>
        <Text mb="1rem" size="sm">
          All products in this category will be deleted permenantly.
        </Text>
        <Group noWrap={false}>
          <Button onClick={() => setDeleteModal(false)}>Exit</Button>
          <Button
            color="red"
            onClick={() =>
              deleteCategory(selectedCategory, {
                onSuccess: () => {
                  queryClient.refetchQueries(["categories"]);
                  setDeleteModal(false);
                },
              })
            }
          >
            Delete
          </Button>
        </Group>
      </Modal>
      {/* CHANGE DETAILS MODAL */}
      <Modal
        centered
        opened={changeModal}
        onClose={() => setChangeModal(false)}
        title="Change Category Details"
      >
        <form
          onSubmit={patchCategoryForm.onSubmit((values) => console.log(values))}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={patchCategoryLoading ?? false}
          />
          <TextInput
            placeholder="Category Name"
            label="Category Name"
            withAsterisk
            mb="1rem"
            {...patchCategoryForm.getInputProps("name")}
          />
          <Group mt="1.5rem">
            <Button
              type="submit"
              onClick={() => {
                patchCategory(
                  {
                    name: patchCategoryForm.values.name,
                    id: selectedCategory,
                  },
                  {
                    onSuccess() {
                      queryClient.refetchQueries(["categories"]);
                      setChangeModal(false);
                    },
                  }
                );
              }}
            >
              Change Details
            </Button>
            <Button
              color={"red"}
              onClick={() => {
                setChangeModal(false);
              }}
            >
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
    </main>
  );
};

categories.requireAuth = true;
export default categories;
