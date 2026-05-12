import { v2 as cloudinary } from "cloudinary";
import { config } from "./env.js";

cloudinary.config({
  cloud_name: String(config.CLOUDINARY_CLOUD_NAME),
  api_key: String(config.CLOUDINARY_API_KEY),
  api_secret: String(config.CLOUDINARY_API_SECRET),
});

export default cloudinary;
