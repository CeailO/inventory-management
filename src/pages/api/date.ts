import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../config/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { DateTime } from "luxon";
import { postDateSchema } from "../../../src/types/postDate";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    // POST NEW DATE TO PRODUCT
    if (req.method === "POST") {
      const { productId, stock, date, totalPrice } = req.body;
      let prismaDate = DateTime.fromISO(date ? date : new date()).toJSDate();
      const isValid = postDateSchema.safeParse({
        productId,
        stock,
        date: prismaDate,
        totalPrice,
      });

      const requestDate = DateTime.fromISO(date).toJSDate();
      const now = new Date();
      requestDate.setHours(now.getHours());
      requestDate.setMinutes(now.getMinutes());
      requestDate.setSeconds(now.getSeconds());

      const product = await prisma.product.findMany({
        where: {
          id: productId,
          userId: session.user?.id,
        },
      });

      if (product.length > 0) {
        try {
          const product = await prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              date: {
                create: {
                  stock: stock,
                  date: date ? requestDate : (Date.now() as any),
                },
              },
            },
          });
          res.json(product);
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: "Something went wrong" });
        }
      }
    }

    // DELETE DATA FROM PRODUCT
    if (req.method === "DELETE") {
      const { productId, id } = req.body;
      try {
        const deletedDate = await prisma.date.deleteMany({
          where: {
            id: id,
            productId: productId,
            product: {
              userId: session.user?.id,
            },
          },
        });
        if (deletedDate.count > 0) {
          res.json({ message: "Date deleted", date: deletedDate });
        } else {
          res.status(404).json({ message: "Date not found" });
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  } else {
    res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  }
  res.end();
};
