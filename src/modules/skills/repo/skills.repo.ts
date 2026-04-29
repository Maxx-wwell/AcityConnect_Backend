import prisma from "../../../config/prisma";
import { CreateSkillInput, UpdateSkillInput } from "./skills.types";

export const createSkill = async (input: CreateSkillInput) => {
    const skill = await prisma.skill.create({
        data: input,
    });
    return skill;
};

export const updateSkill = async (input: UpdateSkillInput) => {
    const skill = await prisma.skill.update({
        where: { id: input.id },    
        data: {
            name: input.name,
        },
    });
    return skill;
};

export const deleteSkill = async (id: string) => {
    const skill = await prisma.skill.delete({
        where: { id },
    });
    return skill;
};