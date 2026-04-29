import { Router } from "express";
import { registerUserController, loginUserController } from "./auth.controller";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);

export { router as authRoutes };