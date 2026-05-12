import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        return {
            folder: "uploads",
            public_id: uniqueSuffix,
            resource_type: "image",
        };
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("File must be an image"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});
