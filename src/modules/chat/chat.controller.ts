import { Request, Response } from "express";
import { queryString } from "../../shared/utils/queryParams";
import {
  createConversationSchema,
  listConversationsQuerySchema,
} from "./repo/chat.types";
import { chatService } from "./chat.service";

export const listConversationsController = async (req: Request, res: Response) => {
  const parsed = listConversationsQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message || "Invalid query");
  }
  try {
    const conversations = await chatService.listConversations(parsed.data.userId);
    res.status(200).json({ conversations });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to list conversations"
    );
  }
};

export const createConversationController = async (req: Request, res: Response) => {
  const parsed = createConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new Error(parsed.error.message || "Invalid body");
  }
  try {
    const conversation = await chatService.createOrGetConversation(parsed.data);
    res.status(201).json({
      message: "Conversation ready",
      conversation,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create conversation"
    );
  }
};
