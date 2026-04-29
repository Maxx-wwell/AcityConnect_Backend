import { Request, Response } from "express";
import { queryString } from "../../shared/utils/queryParams";
import {
  listMessagesQuerySchema,
  sendMessageBodySchema,
} from "./repo/messages.types";
import { messagesService } from "./messages.service";

export const listMessagesController = async (req: Request, res: Response) => {
  const parsed = listMessagesQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message || "Invalid query");
  }
  try {
    const messages = await messagesService.listMessages(
      req.params.conversationId as string,
      parsed.data.userId
    );
    res.status(200).json({ messages });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load messages");
  }
};

export const sendMessageController = async (req: Request, res: Response) => {
  const parsed = sendMessageBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new Error(parsed.error.message || "Invalid body");
  }
  try {
    const message = await messagesService.sendMessage(
      req.params.conversationId as string,
      parsed.data.userId,
      parsed.data.content
    );
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to send message");
  }
};
