import { z } from "zod";
import { CategoryType } from "@prisma/client";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(CategoryType),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  data: createCategorySchema.partial().extend({
    name: z.string().min(1),
    type: z.enum(CategoryType),
  }),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;