import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../config/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) res.status(401).json({ message: "unauthorized" });
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: session?.user?.id,
      },
      select: {
        products: {
          select: {
            name: true,
            price: true,
            id: true,
            lastUpdate: true,
            date: {
              select: {
                stock: true,
              },
              take: 1,
            },
          },
        },
        name: true,
        id: true,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  res.end();
};
