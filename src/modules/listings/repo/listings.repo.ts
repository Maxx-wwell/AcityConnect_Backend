import {
  ListingStatus,
  ModerationStatus,
  type ListingType,
  type Prisma,
} from "@prisma/client";
import prisma from "../../../config/prisma";
import { CreateListingInput, UpdateListingInput, DeleteListingInput } from "./listings.types";

export const createListing = async (input: CreateListingInput) => {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.create({
      data: {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        listingType: input.listingType,
        status: ListingStatus.AVAILABLE,
        moderationStatus: ModerationStatus.PENDING,
        userId: input.userId,
      },
    });

    if (input.imageUrls?.length) {
      await tx.listingImage.createMany({
        data: input.imageUrls.map((imageUrl) => ({
          listingId: listing.id,
          imageUrl,
        })),
      });
    }

    return tx.listing.findUnique({
      where: { id: listing.id },
      include: {
        category: true,
        user: { select: { id: true, email: true } },
        images: { orderBy: { id: "asc" } },
      },
    });
  });
};

export const updateListing = async (input: UpdateListingInput) => {
    const listing = await prisma.listing.update({
        where: { id: input.id },
        data: {
            title: input.data.title ?? undefined,
            description: input.data.description ?? undefined,
            categoryId: input.data.categoryId ?? undefined,
            listingType: input.data.listingType ?? undefined,
        },
    });
    return listing;
};

export const deleteListing = async (input: DeleteListingInput) => {
    return prisma.$transaction(async (tx) => {
        await tx.trade.deleteMany({ where: { listingId: input.id } });
        await tx.report.deleteMany({ where: { listingId: input.id } });
        await tx.adminAction.deleteMany({ where: { listingId: input.id } });

        const listing = await tx.listing.delete({
            where: { id: input.id, userId: input.userid },
        });
        return listing;
    });
};

export const listListings = async (filters: {
  listingType?: ListingType;
  q?: string;
  interestedUserId?: string;
}) => {
  const where: Prisma.ListingWhereInput = {
    moderationStatus: { not: ModerationStatus.REJECTED },
  };

  if (filters.listingType) {
    where.listingType = filters.listingType;
  }

  const extraAnd: Prisma.ListingWhereInput[] = [];

  if (filters.interestedUserId) {
    extraAnd.push({
      interests: { some: { userId: filters.interestedUserId } },
    });
  }

  if (filters.q?.trim()) {
    const term = filters.q.trim();
    extraAnd.push({
      OR: [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ],
    });
  }

  if (extraAnd.length) {
    where.AND = extraAnd;
  }

  return prisma.listing.findMany({
    where,
    include: {
      category: true,
      user: { select: { id: true, email: true } },
      images: { orderBy: { id: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
};