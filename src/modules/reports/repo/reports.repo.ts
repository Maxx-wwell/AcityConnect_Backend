import prisma from "../../../config/prisma";

export const createReport = async (
  listingId: string,
  reportedBy: string,
  reason: string
) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });
  if (!listing) throw new Error("Listing not found");

  return prisma.report.create({
    data: { listingId, reportedBy, reason },
    include: {
      listing: {
        select: { id: true, title: true },
      },
      user: { select: { id: true, email: true } },
    },
  });
};

export const listReportsAdmin = async () => {
  return prisma.report.findMany({
    include: {
      listing: {
        select: { id: true, title: true, userId: true },
      },
      user: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
