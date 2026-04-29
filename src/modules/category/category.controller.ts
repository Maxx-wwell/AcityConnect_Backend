import { Request, Response } from "express";
import { createCategorySchema, updateCategorySchema } from "./repo/category.types";
import { categoryService } from "./category.service";

export const listCategoriesController = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryService.listCategories();
        res.status(200).json({ categories });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to list categories");
    }
};

export const createCategoryController = async (req: Request, res: Response) => {
    const input = createCategorySchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const category = await categoryService.createCategory(input.data);
    res.status(201).json({ message: "Category created successfully", category });
} catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create category");
}
};

export const updateCategoryController = async (req: Request, res: Response) => {
    const input = updateCategorySchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }

    try {
    const category = await categoryService.updateCategory({ id: input.data.id, data: input.data.data });
    res.status(200).json({ message: "Category updated successfully", category });
} catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update category");
}
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
    const category = await categoryService.deleteCategory(id);
    res.status(200).json({ message: "Category deleted successfully", category });
} catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete category");
}
};