import { Router } from "express";
import multer from "multer";
import {
    createListingController,
    deleteListingController,
    listListingsController,
    updateListingController,
    uploadListingImagesController,
} from "./listings.controller";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 8 },
    fileFilter: (_req, file, cb) => {
        const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
        if (ok) cb(null, true);
        else cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    },
});

const router = Router();

router.get("/", listListingsController);
router.post(
    "/upload-images",
    upload.array("images", 8),
    uploadListingImagesController
);
router.post("/", createListingController);
router.put("/:id", updateListingController);
router.delete("/:id", deleteListingController);

export { router as listingsRoutes };

