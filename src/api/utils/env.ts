import dotenv from "dotenv";
dotenv.config();

export const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
}

