import { Request, Response } from "express";
import { queryString } from "../../shared/utils/queryParams";
import {
  createReportSchema,
  listReportsQuerySchema,
} from "./repo/reports.types";
import { reportsService } from "./reports.service";

export const createReportController = async (req: Request, res: Response) => {
  const parsed = createReportSchema.safeParse(req.body);
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid body");
  try {
    const report = await reportsService.submitReport(
      parsed.data.listingId,
      parsed.data.reportedBy,
      parsed.data.reason
    );
    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to submit report"
    );
  }
};

export const listReportsController = async (req: Request, res: Response) => {
  const parsed = listReportsQuerySchema.safeParse({
    adminUserId: queryString(req, "adminUserId"),
  });
  if (!parsed.success) throw new Error(parsed.error.message || "Invalid query");
  try {
    const reports = await reportsService.listForAdmin(parsed.data.adminUserId);
    res.status(200).json({ reports });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to list reports"
    );
  }
};
