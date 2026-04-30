import type { ListingType } from "@prisma/client";
import {
    assertListingImageRefs,
    attachSignedUrlsToListingImages,
    attachSignedUrlsToListings,
} from "../../shared/utils/mediaUploader";
import * as listingsRepo from "./repo/listings.repo";
import { CreateListingInput, UpdateListingInput, DeleteListingInput } from "./repo/listings.types";

export const listingsService = {
    createListing: async (input: CreateListingInput) => {
        let normalized = input;
        if (input.imageUrls?.length) {
            const paths = assertListingImageRefs(input.imageUrls);
            normalized = { ...input, imageUrls: paths };
        }
        const listing = await listingsRepo.createListing(normalized);
        if (!listing) {
            throw new Error("Listing was not created");
        }
        return attachSignedUrlsToListingImages(listing);
    },
    updateListing: async (input: UpdateListingInput) => {
        return await listingsRepo.updateListing(input);
    },
    deleteListing: async (input: DeleteListingInput) => {
        return await listingsRepo.deleteListing(input);
    },
    listListings: async (filters: {
        listingType?: ListingType;
        q?: string;
        interestedUserId?: string;
    }) => {
        const listings = await listingsRepo.listListings(filters);
        return attachSignedUrlsToListings(listings);
    },
};