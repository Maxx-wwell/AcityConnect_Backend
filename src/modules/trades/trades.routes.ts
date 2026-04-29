import { Router } from "express";
import {
  createTradeController,
  listTradesController,
  updateTradeController,
} from "./trades.controller";

const router = Router();

router.get("/", listTradesController);
router.post("/", createTradeController);
router.patch("/:id", updateTradeController);

export { router as tradesRoutes };
