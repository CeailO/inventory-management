import {
  Box,
  Group,
  ThemeIcon,
  Title,
  Text,
  Stack,
  Button,
  Modal,
  LoadingOverlay,
  Paper,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { FiSettings } from "react-icons/fi";
import { CustomNextPage } from "../types/CustomNextPage";
import { Avatar } from "@mantine/core";
import { useState } from "react";
import { useDelAccount } from "../queries/AccountQueries";

const getWordInitials = (word: string): string => {
  const bits = word.trim().split(" ");
  return bits
    .map((bit) => bit.charAt(0))
    .join("")
    .toUpperCase();
};

const settings: CustomNextPage = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const { data: session } = useSession();
  const { mutate: delAcc, isLoading: delAccLoading } = useDelAccount();
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* TITLE */}
        <Group align="center" mb="2rem" mt="1rem">
          <Title size="1.5rem" weight="500">
            Settings
          </Title>
        </Group>
      {/* ACCOUNT INFO */}
      <Paper shadow="sm" p="md">
        <Box sx={{ height: "100%" }}>
          <Stack align={"center"} sx={{ height: "100%" }}>
            <Text align="center">{`You are logged in as:`}</Text>
            <Text weight={600}>{`${session?.user?.email}`}</Text>
            <Avatar
              src={session?.user?.image}
              radius="xl"
              color="blue"
              variant="light"
              size="lg"
            >{`${getWordInitials(session?.user?.name ?? "")}`}</Avatar>
            <Group align={"center"} sx={{ justifyContent: "center" }}>
              <Button onClick={() => signOut()} sx={{ width: "180px" }}>
                Sign out
              </Button>
              <Button
                color="red"
                sx={{ width: "180px" }}
                onClick={() => setDeleteModal(true)}
              >
                Delete Account
              </Button>
            </Group>
          </Stack>
        </Box>
      </Paper>
      {/* DELETE ACCOUT MODAL */}
      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
      >
        <LoadingOverlay visible={delAccLoading} />
        <Group align="center" sx={{ justifyContent: "center" }}>
          <Title size="1.5rem" weight="500">
            Account Deletion
          </Title>
        </Group>
        <Box sx={{ height: "100%" }}>
          <Stack align={"center"} sx={{ height: "100%" }}>
            <Text
              align="center"
              color="red"
            >{`Are you sure you want to delete your account?`}</Text>
            <Group align={"center"} sx={{ justifyContent: "center" }}>
              <Button
                onClick={() => setDeleteModal(false)}
                sx={{ width: "180px" }}
              >
                Cancel
              </Button>
              <Button
                color="red"
                sx={{ width: "180px" }}
                onClick={() =>
                  delAcc(undefined, {
                    onError: () => {
                      setDeleteModal(false);
                      window.location.reload();
                    },
                  })
                }
                disabled={delAccLoading}
              >
                Delete My Account
              </Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

settings.requireAuth = true;

export default settings;
