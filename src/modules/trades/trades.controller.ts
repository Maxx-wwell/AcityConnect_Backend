import { Request, Response } from "express";
import { queryString, routeParam } from "../../shared/utils/queryParams";
import {
  createTradeSchema,
  listTradesQuerySchema,
  updateTradeSchema,
} from "./repo/trades.types";
import { tradesService } from "./trades.service";

export const createTradeController = async (req: Request, res: Response) => {
  const parsed = createTradeSchema.safeParse(req.body);
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid body");
  try {
    const trade = await tradesService.requestTrade(
      parsed.data.listingId,
      parsed.data.requesterId
    );
    res.status(201).json({ message: "Trade request created", trade });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create trade");
  }
};

export const listTradesController = async (req: Request, res: Response) => {
  const parsed = listTradesQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid query");
  try {
    const trades = await tradesService.listForUser(parsed.data.userId);
    res.status(200).json({ trades });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to list trades");
  }
};

export const updateTradeController = async (req: Request, res: Response) => {
  const parsed = updateTradeSchema.safeParse(req.body);
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid body");
  const tradeId = routeParam(req, "id");
  if (!tradeId) throw new Error("Missing trade id");
  try {
    const trade = await tradesService.updateStatus(
      tradeId,
      parsed.data.userId,
      parsed.data.status
    );
    res.status(200).json({ message: "Trade updated", trade });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update trade");
  }
};
