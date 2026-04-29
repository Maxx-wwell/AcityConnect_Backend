import { Router } from "express";
import { createSkillController, updateSkillController, deleteSkillController } from "./skills.controller";

const router = Router();

router.post("/", createSkillController);
router.put("/:id", updateSkillController);
router.delete("/:id", deleteSkillController);

export { router as skillsRoutes };

