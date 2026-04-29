import { Request, Response } from "express";
import { createSkillSchema, updateSkillSchema } from "./repo/skills.types";
import { skillsService } from "./skills.service";

export const createSkillController = async (req: Request, res: Response) => {
    const input = createSkillSchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const skill = await skillsService.createSkill(input.data);
    res.status(201).json({ message: "Skill created successfully", skill });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create skill");
    }
};

export const updateSkillController = async (req: Request, res: Response) => {
    const input = updateSkillSchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const skill = await skillsService.updateSkill(input.data);
    res.status(200).json({ message: "Skill updated successfully", skill });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update skill");
    }
};

export const deleteSkillController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
    const skill = await skillsService.deleteSkill(id);
    res.status(200).json({ message: "Skill deleted successfully", skill });
} catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete skill");
}
};