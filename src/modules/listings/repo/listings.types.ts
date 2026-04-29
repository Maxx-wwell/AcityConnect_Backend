import { z } from "zod";
import { ListingType } from "@prisma/client";
export const createListingSchema = z.object({
  userId: z.uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.uuid(),
  listingType: z.enum(ListingType),
  /** Storage object paths (`listings/…`), typically returned by POST /listings/upload-images */
  imageUrls: z.array(z.string().min(1).max(512)).max(8).optional(),
});



export const updateListingSchema = z.object({
  id: z.uuid(),
  data: createListingSchema.partial().extend({
    title: z.string().min(1),
    description: z.string().min(1),
    categoryId: z.uuid(),
    listingType: z.enum(ListingType),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;