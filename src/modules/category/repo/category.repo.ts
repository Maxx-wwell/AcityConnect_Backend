import prisma from "../../../config/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export const createCategory = async (input: CreateCategoryInput) => {
    const category = await prisma.category.create({
        data: input,
    });
    return category;
};

export const updateCategory = async (input: UpdateCategoryInput) => {
    const category = await prisma.category.update({
        where: { id: input.id },    
        data: {
            name: input.data.name ?? undefined,
            type: input.data.type ?? undefined,
        },
    });
    return category;
};

export const deleteCategory = async (id: string) => {
    const category = await prisma.category.delete({
        where: { id },
    });
    return category;
};

export const listCategories = async () => {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
    });
};