import { Router } from "express";
import {
    createCategoryController,
    deleteCategoryController,
    listCategoriesController,
    updateCategoryController,
} from "./category.controller";

const router = Router();

router.get("/", listCategoriesController);
router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export { router as categoryRoutes };