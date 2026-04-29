import { randomUUID } from "node:crypto";
import {
  getSupabaseAdmin,
  isSupabaseStorageConfigured,
} from "../../config/supbase";

const bucket = process.env.SUPABASE_STORAGE_BUCKET || "listings";
const maxBytes = 5 * 1024 * 1024;

/** TTL for signed URLs returned to clients (refresh on each API load). */
const signedUrlExpirySec = Number(
  process.env.LISTING_IMAGE_SIGNED_URL_EXPIRY_SEC || "86400"
);

const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const extFromMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const listingPathRegex =
  /^listings\/[a-zA-Z0-9_.\-]+\.(jpg|jpeg|png|webp|gif)$/i;

export function getListingImagePublicUrlPrefix(): string | null {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/`;
}

/**
 * DB stores object paths (`listings/…`). Legacy rows may still hold old public URLs;
 * normalize to the path inside the bucket.
 */
export function normalizeToListingStoragePath(stored: string): string | null {
  const t = stored.trim();
  if (!t) return null;
  if (listingPathRegex.test(t)) return t;

  const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (base) {
    const signPrefix = `${base}/storage/v1/object/sign/${bucket}/`;
    if (t.startsWith(signPrefix)) {
      const raw = t.slice(signPrefix.length).split("?")[0] ?? "";
      const path = decodeURIComponent(raw);
      return listingPathRegex.test(path) ? path : null;
    }
  }

  const prefix = getListingImagePublicUrlPrefix();
  if (prefix && t.startsWith(prefix)) {
    const path = t.slice(prefix.length).split("?")[0] ?? "";
    return listingPathRegex.test(path) ? path : null;
  }

  return null;
}

/** Validates upload/create payload and returns canonical paths for Prisma. */
export function assertListingImageRefs(refs: string[]): string[] {
  const paths = refs.map((r) => normalizeToListingStoragePath(r));
  if (paths.some((p) => !p)) {
    throw new Error("Invalid image path or URL");
  }
  return paths as string[];
}

export type ListingUploadFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

async function createSignedUrlForPath(path: string): Promise<string> {
  if (!isSupabaseStorageConfigured()) {
    throw new Error("File storage is not configured");
  }
  const client = getSupabaseAdmin();
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, signedUrlExpirySec);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Could not create signed URL");
  }
  return data.signedUrl;
}

/** Signed GET URL for a stored path or legacy public URL (normalized to path). */
export async function signStoredListingImageRef(
  stored: string
): Promise<string | null> {
  const path = normalizeToListingStoragePath(stored);
  if (!path) return null;
  try {
    return await createSignedUrlForPath(path);
  } catch {
    return null;
  }
}

export async function signListingStoragePaths(
  paths: string[]
): Promise<string[]> {
  return Promise.all(paths.map((p) => createSignedUrlForPath(p)));
}

export async function attachSignedUrlsToListingImages<
  T extends { images?: { imageUrl: string; id?: string }[] },
>(entity: T): Promise<T> {
  if (!entity.images?.length) return entity;
  const images = await Promise.all(
    entity.images.map(async (img) => {
      const signed = await signStoredListingImageRef(img.imageUrl);
      return {
        ...img,
        imageUrl: signed ?? img.imageUrl,
      };
    })
  );
  return { ...entity, images };
}

export async function attachSignedUrlsToListings<
  L extends { images?: { imageUrl: string; id?: string }[] },
>(listings: L[]): Promise<L[]> {
  return Promise.all(listings.map((l) => attachSignedUrlsToListingImages(l)));
}

export async function uploadListingImagesToStorage(
  files: ListingUploadFile[]
): Promise<string[]> {
  if (!isSupabaseStorageConfigured()) {
    throw new Error(
      "File storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)"
    );
  }
  const client = getSupabaseAdmin();
  const paths: string[] = [];

  for (const file of files) {
    if (file.size > maxBytes) {
      throw new Error("Each image must be 5MB or smaller");
    }
    if (!allowedMime.has(file.mimetype)) {
      throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
    }
    const ext = extFromMime[file.mimetype];
    if (!ext) {
      throw new Error("Unsupported image type");
    }

    const path = `listings/${randomUUID()}.${ext}`;
    const { error } = await client.storage.from(bucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
    if (error) {
      throw new Error(error.message || "Upload failed");
    }

    paths.push(path);
  }

  return paths;
}
