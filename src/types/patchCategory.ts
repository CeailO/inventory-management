import { z } from "zod";
const patchCategorySchema = z.object({
  id: z.string().min(1, { message: "Id must be at least 1 letter" }),
  name: z.string().min(2, { message: "Name must be at least 2 letters" }),
});

type PatchCategory = z.infer<typeof patchCategorySchema>;
export { patchCategorySchema, type PatchCategory };
