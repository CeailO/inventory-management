import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { CustomNextPage } from "../../src/types/CustomNextPage";
import { Button, Center, Paper } from "@mantine/core";

const Home: CustomNextPage = () => {
  const { data, status } = useSession();
  return (
    <>
      <Center sx={{ width: "100vw", height: "100vh" }}>
        <Paper shadow="xs" p="xl" withBorder>
          {data?.user?.email || <Button onClick={() => signIn()}>Sign In</Button>}
          {status === "authenticated" && (
            <>
              <Button color="blue" onClick={() => signOut()}>
                Sign Out
              </Button>
              <Button>
                <Link href="/categories">Protected Page</Link>
              </Button>
            </>
          )}
        </Paper>
      </Center>
    </>
  );
};

Home.requireAuth = false;

export default Home;
