import type { ListingType } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../config/prisma";
import { queryString } from "../../shared/utils/queryParams";
import {
    signListingStoragePaths,
    uploadListingImagesToStorage,
} from "../../shared/utils/mediaUploader";
import { createListingSchema, updateListingSchema } from "./repo/listings.types";
import { listingsService } from "./listings.services";

const uploadListingBodySchema = z.object({
  userId: z.uuid(),
});

export const listListingsController = async (req: Request, res: Response) => {
    const listingTypeParam = req.query.listingType as string | undefined;
    const listingType =
        listingTypeParam === "ITEM" || listingTypeParam === "SKILL"
            ? (listingTypeParam as ListingType)
            : undefined;
    const q = queryString(req, "q");
    const interestedUserId = queryString(req, "interestedUserId");
    try {
        const filters: {
            listingType?: ListingType;
            q?: string;
            interestedUserId?: string;
        } = {};
        if (listingType !== undefined) filters.listingType = listingType;
        if (q !== undefined) filters.q = q;
        if (interestedUserId !== undefined) filters.interestedUserId = interestedUserId;
        const listings = await listingsService.listListings(filters);
        res.status(200).json({ listings });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to list listings");
    }
};

export const createListingController = async (req: Request, res: Response) => {
    const input = createListingSchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const listing = await listingsService.createListing(input.data);
    res.status(201).json({ message: "Listing created successfully", listing });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create listing");
    }
};

/** Multipart upload to Supabase Storage (private bucket). Returns paths + short-lived signed URLs. */
export const uploadListingImagesController = async (req: Request, res: Response) => {
    const parsed = uploadListingBodySchema.safeParse({
        userId: typeof req.body?.userId === "string" ? req.body.userId : undefined,
    });
    if (!parsed.success) {
        throw new Error(parsed.error.message || "userId is required");
    }

    const files = req.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error("No images provided");
    }
    if (files.length > 8) {
        throw new Error("At most 8 images per listing");
    }

    const user = await prisma.user.findUnique({
        where: { id: parsed.data.userId },
        select: { id: true },
    });
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const paths = await uploadListingImagesToStorage(
            files.map((f) => ({
                buffer: f.buffer,
                mimetype: f.mimetype,
                size: f.size,
            }))
        );
        const signedUrls = await signListingStoragePaths(paths);
        res.status(200).json({
            message: "Uploaded",
            paths,
            signedUrls,
            urls: signedUrls,
        });
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Upload failed");
    }
};

export const updateListingController = async (req: Request, res: Response) => {
    const input = updateListingSchema.safeParse(req.body);
    if (!input.success) {
        throw new Error(input.error.message || "Invalid input");
    }
    try {
    const listing = await listingsService.updateListing({ id: input.data.id, data: input.data.data });
    res.status(200).json({ message: "Listing updated successfully", listing });
} catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update listing");
}
};

export const deleteListingController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.query.userId as string;
    try {
    const listing = await listingsService.deleteListing({ id, userid: userId });
    res.status(200).json({ message: "Listing deleted successfully", listing });
} catch (error) { 
    throw new Error(error instanceof Error ? error.message : "Failed to delete listing");
}
};