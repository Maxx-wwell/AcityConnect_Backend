import { Router } from "express";
import {
  createInterestController,
  deleteInterestController,
  listListingInterestsController,
  listMyInterestsController,
} from "./interests.controller";

const router = Router();

router.get("/me", listMyInterestsController);
router.get("/listing/:listingId", listListingInterestsController);
router.post("/", createInterestController);
router.delete("/:listingId", deleteInterestController);

export { router as interestsRoutes };
