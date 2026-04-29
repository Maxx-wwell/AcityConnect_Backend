import { Router } from "express";
import { listMessagesController, sendMessageController } from "./messages.controller";

const router = Router();

router.get("/:conversationId", listMessagesController);
router.post("/:conversationId", sendMessageController);

export { router as messagesRoutes };
