import { Request, Response } from "express";
import { queryString, routeParam } from "../../shared/utils/queryParams";
import {
  createInterestSchema,
  deleteInterestQuerySchema,
  userQuerySchema,
} from "./repo/interests.types";
import { interestsService } from "./interests.service";

export const createInterestController = async (req: Request, res: Response) => {
  const parsed = createInterestSchema.safeParse(req.body);
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid body");
  try {
    const row = await interestsService.expressInterest(
      parsed.data.listingId,
      parsed.data.userId
    );
    res.status(201).json({ message: "Interest recorded", interest: row });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to record interest"
    );
  }
};

export const deleteInterestController = async (req: Request, res: Response) => {
  const parsed = deleteInterestQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid query");
  const listingId = routeParam(req, "listingId");
  if (!listingId) throw new Error("Missing listing id");
  try {
    await interestsService.removeInterest(listingId, parsed.data.userId);
    res.status(200).json({ message: "Interest removed" });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to remove interest"
    );
  }
};

export const listMyInterestsController = async (req: Request, res: Response) => {
  const parsed = userQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid query");
  try {
    const interests = await interestsService.listMine(parsed.data.userId);
    res.status(200).json({ interests });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to list interests"
    );
  }
};

export const listListingInterestsController = async (
  req: Request,
  res: Response
) => {
  const parsed = userQuerySchema.safeParse({
    userId: queryString(req, "userId"),
  });
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid query");
  const listingId = routeParam(req, "listingId");
  if (!listingId) throw new Error("Missing listing id");
  try {
    const interests = await interestsService.listForListing(
      listingId,
      parsed.data.userId
    );
    res.status(200).json({ interests });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to list listing interests"
    );
  }
};
