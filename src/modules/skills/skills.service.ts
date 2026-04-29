import * as skillsRepo from "./repo/skills.repo";
import { CreateSkillInput, UpdateSkillInput } from "./repo/skills.types";

export const skillsService = {
    createSkill: async (input: CreateSkillInput) => {
        return await skillsRepo.createSkill(input);
    },
    updateSkill: async (input: UpdateSkillInput) => {
        return await skillsRepo.updateSkill(input);
    },
    deleteSkill: async (id: string) => {
        return await skillsRepo.deleteSkill(id);
    },
};