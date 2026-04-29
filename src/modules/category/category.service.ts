import * as categoryRepo from "./repo/category.repo";
import { CreateCategoryInput, UpdateCategoryInput } from "./repo/category.types";

export const categoryService = {
    createCategory: async (input: CreateCategoryInput) => {
        return await categoryRepo.createCategory(input);
    },
    updateCategory: async (input: UpdateCategoryInput) => {
        return await categoryRepo.updateCategory(input);
    },
    deleteCategory: async (id: string) => {
        return await categoryRepo.deleteCategory(id);
    },
    listCategories: async () => {
        return await categoryRepo.listCategories();
    },
};