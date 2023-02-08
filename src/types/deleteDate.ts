import { z } from "zod";
const deleteDateSchema = z.object({
  productId: z.string().min(1, { message: "Id must be at least 1 letter" }),
  id: z.string().min(1, { message: "Id must be at least 1 letter" }),
});

type DeleteDateTypes = z.infer<typeof deleteDateSchema>;
export { deleteDateSchema, type DeleteDateTypes };
