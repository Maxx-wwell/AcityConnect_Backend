import { z } from "zod";

export const createReportSchema = z.object({
  listingId: z.uuid(),
  reportedBy: z.uuid(),
  reason: z.string().min(1).max(2000),
});

export const listReportsQuerySchema = z.object({
  adminUserId: z.uuid(),
});
