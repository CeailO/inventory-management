import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { postCategorySchema } from "../../../src/types/postCategory";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) res.status(401).json({ message: "Unauthorized" });
  if (req.method === "POST") {
    const { name } = req.body;
    const response = postCategorySchema.safeParse(req.body);
    if (!response.success) {
      res.status(400);
    }
    try {
      const category = await prisma?.category.create({
        data: {
          name: name,
          userId: session?.user?.id,
        },
      });
      res.status(201).json({ category });
    } catch (error) {
      res.status(500).json({ message: "Error creating category" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "No id provided" });
    try {
      const category = await prisma?.category.deleteMany({
        where: {
          userId: session?.user?.id,
          id: id.toString(),
        },
      });
      res.status(201).json({ category });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  } else if (req.method === "PATCH") {
    const { id, name } = req.body;
    if (!id || !name)
      return res.status(400).json({ message: "No id or name provided" });
    try {
      const category = await prisma?.category.updateMany({
        where: {
          userId: session?.user?.id,
          id: id.toString(),
        },
        data: {
          name: name,
        },
      });
      res.status(201).json({ category });
    } catch (error) {
      return res.status(500).json({ message: "Error updating category" });
    }
  } else {
    res.status(400).json({ message: "Methode not found" });
  }
  res.end();
};
