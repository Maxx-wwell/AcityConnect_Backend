import { Router } from "express";
import {
  createConversationController,
  listConversationsController,
} from "./chat.controller";

const router = Router();

router.get("/conversations", listConversationsController);
router.post("/conversations", createConversationController);

export { router as chatRoutes };
