import { Router } from "express";
import { createProfileController, updateProfileController } from "./profile.controller";

const router = Router();

router.post("/", createProfileController);
router.put("/:userId", updateProfileController);

export { router as profileRoutes };

