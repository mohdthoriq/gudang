import { Router } from "express";
import { prisma } from "../../../config/prisma.js"; // Sesuaikan path prisma
import { ProfileRepository } from "./profile.repo.js";
import { ProfileService } from "./profile.service.js";
import { ProfileController } from "./profile.controller.js";
import { validate } from "../../../utils/validate.js";
import { createProfileSchema, updateProfileSchema } from "./profile.schema.js";
import { adminMiddleware } from "../../../middleware/role.middleware.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { upload } from "../../../middleware/upload.middleware.js";

/**
 * @swagger
 * tags:
 *   - name: Profiles
 *     description: User profile management
 */

const router = Router();

// Inisialisasi Dependency Injection
const profileRepo = new ProfileRepository(prisma);
const profileService = new ProfileService(profileRepo);
const profileController = new ProfileController(profileService);

// Routes
// Catatan: Tambahkan middleware otorisasi (misal: requireAdmin) untuk route getAll, create, dan delete

/**
 * @swagger
 * /api/v1/user-profile:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan kata kunci
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter data
 *     responses:
 *       200:
 *         description: List of all profiles
 */
router.get("/", authenticate, adminMiddleware, profileController.getAllProfiles);

/**
 * @swagger
 * /api/v1/user-profile/stats:
 *   get:
 *     summary: Get user profile statistics
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile statistics
 */
router.get("/stats", authenticate, adminMiddleware, profileController.getProfileStats);

/**
 * @swagger
 * /api/v1/user-profile/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "prof_123"
 *     responses:
 *       200:
 *         description: Profile details
 */
router.get("/:id", authenticate, profileController.getProfileById);

/**
 * @swagger
 * /api/v1/user-profile:
 *   post:
 *     summary: Create a new profile with photo upload
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Muhammad Rizki
 *               email:
 *                 type: string
 *                 example: muhammad@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               role:
 *                 type: string
 *                 enum: [SANTRI, MENTOR, WALI_SANTRI]
 *                 example: SANTRI
 *               address:
 *                 type: string
 *                 example: "Jl. Merdeka No. 123, Jakarta"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "2005-01-01"
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile created successfully
 */
router.post("/", authenticate, upload.single("photoUrl"), validate(createProfileSchema), profileController.createProfile);

/**
 * @swagger
 * /api/v1/user-profile/{id}:
 *   put:
 *     summary: Update a profile with photo upload
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "prof_123"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Muhammad Rizki Updated
 *               address:
 *                 type: string
 *                 example: "Jl. Baru No. 456, Bandung"
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/:id", authenticate, upload.single("photoUrl"), validate(updateProfileSchema), profileController.updateProfile);

/**
 * @swagger
 * /api/v1/user-profile/{id}:
 *   delete:
 *     summary: Delete a profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "prof_123"
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete("/:id", authenticate, profileController.deleteProfile);

export default router;
