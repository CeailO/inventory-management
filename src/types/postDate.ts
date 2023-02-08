import { z } from "zod";
const postDateSchema = z.object({
  productId: z.string().min(1, { message: "Id must be at least 1 letter" }),
  date: z.date().optional(),
  stock: z
    .number()
    .min(0, { message: "Stock must be greater than 0" })
    .positive({ message: "Stock must be positive" }),
  totalPrice: z.number().array(),
});

type PostDate = z.infer<typeof postDateSchema>;
export { postDateSchema, type PostDate };
