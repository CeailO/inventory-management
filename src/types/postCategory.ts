import { z } from "zod";

const postCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
});

type PostCategory = z.infer<typeof postCategorySchema>;
export { postCategorySchema, type PostCategory };
