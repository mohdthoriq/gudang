import type { Request, Response } from "express";
import { WaliProfileService } from "./waliProfile.service.js";
import { successResponse } from "../../../utils/response.js";
import type { ICreateWaliProfile, IUpdateWaliProfile } from "./waliProfile.schema.js";
import { AppError } from "../../../appErr.js";
import cloudinary from "../../../utils/cloudinary.js";

export class WaliProfileController {
    constructor(private service: WaliProfileService) { }

    getAllProfiles = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const role = req.query.role as string;

        
        let isActive: boolean | undefined;
        if (req.query.isActive === "true") isActive = true;
        else if (req.query.isActive === "false") isActive = false;

        const result = await this.service.getAllProfiles(page, limit, search, role, isActive);
        successResponse(res, "Berhasil mengambil data profil wali", result.data, result.meta, 200);
    };

    getProfileByUserId = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const result = await this.service.getProfileByUserId(userId as string);
        successResponse(res, "Berhasil mengambil data profil wali", result, null, 200);
    };

    createProfile = async (req: Request, res: Response) => {
        const file = req.file;
        if (!file) {
            throw new AppError("File tidak ditemukan", 404);
        }

        const data = {
            ...req.body,
            photoUrl: file.path,
        }

        const result = await this.service.createProfile(data as ICreateWaliProfile);
        successResponse(res, "Profil wali berhasil dibuat", result, null, 201);
    };

    updateProfile = async (req: Request, res: Response) => {
        const { id } = req.params;
        const file = req.file;

        const existing = await this.service.getProfileByUserId(id as string);

        const data = { ...req.body };

        if (file) {
            if (existing?.photoUrl) {
                await this.deleteCloudinaryImage(existing.photoUrl);
            }
            data.photoUrl = file.path;
        }

        const result = await this.service.updateProfile(id as string, data as IUpdateWaliProfile);
        successResponse(res, "Profil wali berhasil diupdate", result, null, 200);
    };

    deleteProfile = async (req: Request, res: Response) => {
        const { id } = req.params;
        const existing = await this.service.getProfileByUserId(id as string);
        if (existing?.photoUrl) {
            await this.deleteCloudinaryImage(existing.photoUrl);
        }
        await this.service.deleteProfile(id as string);
        successResponse(res, "Profil wali berhasil dihapus", null, null, 200);
    };

    private async deleteCloudinaryImage(photoUrl: string) {
        if (!photoUrl) return;
        const urlParts = photoUrl.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        const secondLastPart = urlParts[urlParts.length - 2];

        if (!lastPart || !secondLastPart) return;

        const fileName = lastPart.split(".")[0];
        const folderName = secondLastPart;
        const publicId = `${folderName}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
    }

    getWaliProfileStats = async (req: Request, res: Response) => {
        const result = await this.service.getWaliProfileStats();
        successResponse(res, "Statistik profil wali santri berhasil diambil", result, null, 200);
    };
}
