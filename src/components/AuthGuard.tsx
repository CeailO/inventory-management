import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Loader, Center } from "@mantine/core";
import React, { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated")
      if (router.pathname != "/auth/signin") router.push("/auth/signin");
  }, [status, session?.user]);

  if (status === "loading")
    return (
      <Center sx={{ width: "100vw", height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  if (status === "authenticated") return children;
};

export default AuthGuard;
