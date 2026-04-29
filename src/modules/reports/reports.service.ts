import { Role } from "@prisma/client";
import prisma from "../../config/prisma";
import * as reportsRepo from "./repo/reports.repo";

async function assertAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Admin access required");
  }
}

export const reportsService = {
  submitReport: async (
    listingId: string,
    reportedBy: string,
    reason: string
  ) => {
    return await reportsRepo.createReport(listingId, reportedBy, reason);
  },

  listForAdmin: async (adminUserId: string) => {
    await assertAdmin(adminUserId);
    return await reportsRepo.listReportsAdmin();
  },
};
