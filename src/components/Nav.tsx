import {
  MantineNumberSize,
  ActionIcon,
  Box,
  Navbar,
  ScrollArea,
  useMantineColorScheme,
  Title,
  ThemeIcon,
  UnstyledButton,
  Group,
  Avatar,
  useMantineTheme,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { ImSun, ImIcoMoon } from "react-icons/im";
import { GoArchive, GoDashboard } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { sizes } from "@mantine/core/lib/ActionIcon/ActionIcon.styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Brand = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Group position="apart" align="center">
        {/* LOGO */}
        {/* DARK - LIGHT MODE */}
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={30}
        >
          {colorScheme === "dark" ? (
            <ImSun size={18} />
          ) : (
            <ImIcoMoon size={18} />
          )}
        </ActionIcon>
      </Group>
    </Box>
  );
};

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  pageLink: string;
  // Recheck
  setOpened: any;
}

const MainLink = ({
  icon,
  color,
  label,
  pageLink,
  setOpened,
}: MainLinkProps) => {
  const { pathname } = useRouter();
  return (
    <Link href={pageLink} passHref>
      <UnstyledButton
        onClick={() => setOpened(false)}
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.black : theme.black,
          backgroundColor:
            pathname === pageLink
              ? theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0]
              : "transparent",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant={"light"}>
            {icon}
          </ThemeIcon>
          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
};

const data: MainLinkProps[] = [
  {
    icon: <GoDashboard size={18} />,
    color: "blue",
    label: "Dashboard",
    pageLink: "/dashboard",
    setOpened: () => {},
  },
  {
    icon: <BiCategory size={18} />,
    color: "teal",
    label: "Categories",
    pageLink: "/categories",
    setOpened: () => {},
  },
  {
    icon: <BsBox size={16} />,
    color: "violet",
    label: "Inventory",
    pageLink: "/inventory",
    setOpened: () => {},
  },
  {
    icon: <TbClipboardList size={20} />,
    color: "grape",
    label: "Products",
    pageLink: "/products",
    setOpened: () => {},
  },
  {
    icon: <FiSettings size={16} />,
    color: "orange",
    label: "Settings",
    pageLink: "/settings",
    setOpened: () => {},
  },
];

const getWordInitials = (word: string): string => {
  const bits = word.trim().split(" ");
  return bits
    .map((bit) => bit.charAt(0))
    .join(" ")
    .toUpperCase();
};

const User = () => {
  const theme = useMantineTheme();
  const { data: session } = useSession();
  const { pathname } = useRouter();

  return (
    <Link passHref href={pathname === "/settings" ? "/" : "/settings"}>
      <Box
        sx={{
          paddingTop: theme.spacing.sm,
          borderTop: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        }}
      >
        <UnstyledButton
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group>
            {/* IMAGE */}
            <Avatar
              src={session?.user?.image}
              radius="xl"
              color="blue"
              variant="light"
            >{`${getWordInitials(session?.user?.name ?? "")}`}</Avatar>
            {/* INFO */}
            <Box sx={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {session?.user?.name}
              </Text>
              <Text color="dimmed" size="xs">
                {session?.user?.email}
              </Text>
            </Box>
            {/* BUTTON */}
            {pathname === "/setting" ? (
              <MdKeyboardArrowLeft size={18} />
            ) : (
              <MdKeyboardArrowRight size={18} />
            )}
          </Group>
        </UnstyledButton>
      </Box>
    </Link>
  );
};

const Nav = ({
  setOpened,
  opened,
  hiddenBreakpoint,
}: {
  setOpened: (value: boolean) => void;
  opened: boolean;
  hiddenBreakpoint: MantineNumberSize;
}) => {
  return (
    <Navbar
      p="xs"
      width={{ sm: 300 }}
      hiddenBreakpoint={hiddenBreakpoint}
      hidden={!opened}
    >
      <Navbar.Section mt="xs">
        <Brand />
      </Navbar.Section>
      <Navbar.Section grow mt="md" component={ScrollArea}>
        {data.map((item, index) => (
          <MainLink {...item} key={item.label} setOpened={setOpened} />
        ))}
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
