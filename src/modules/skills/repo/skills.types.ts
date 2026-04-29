import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(1),
});


export const updateSkillSchema = z.object({
    id: z.uuid().min(1),
    name: z.string().min(1),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;