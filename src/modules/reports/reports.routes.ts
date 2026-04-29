import { Router } from "express";
import { createReportController, listReportsController } from "./reports.controller";

const router = Router();

router.post("/", createReportController);
router.get("/", listReportsController);

export { router as reportsRoutes };
