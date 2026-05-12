import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { DivisionRepository } from "./division.repo.js";
import { DivisionService } from "./division.service.js";
import { DivisionController } from "./division.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../middleware/role.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../utils/validate.js";
import { createDivisionSchema, updateDivisionSchema } from "./division.schema.js";

/**
 * @swagger
 * tags:
 *   - name: Divisions
 *     description: Division management
 */

const router = Router();

// Inisialisasi OOP
const divisionRepo = new DivisionRepository(prisma);
const divisionService = new DivisionService(divisionRepo);
const divisionController = new DivisionController(divisionService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/divisions:
 *   get:
 *     summary: Get all divisions
 *     tags: [Divisions]
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
 *         description: List of all divisions
 */
router.get("/", authenticate, divisionController.getAllDivisions);

/**
 * @swagger
 * /api/v1/divisions/stats:
 *   get:
 *     summary: Get division statistics
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Division statistics
 */
router.get("/stats", authenticate, divisionController.getDivisionStats);

/**
 * @swagger
 * /api/v1/divisions/{id}:
 *   get:
 *     summary: Get division by ID
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "div_123"
 *     responses:
 *       200:
 *         description: Division details
 *       404:
 *         description: Division not found
 */
router.get("/:id", authenticate, divisionController.getDivisionById);

/**
 * @swagger
 * /api/v1/divisions:
 *   post:
 *     summary: Create a new division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: IT Development
 *               description:
 *                 type: string
 *                 example: Division responsible for software development and IT infrastructure
 *     responses:
 *       201:
 *         description: Division created successfully
 */
router.post("/", authenticate, adminMiddleware, validate(createDivisionSchema), divisionController.createDivision);

/**
 * @swagger
 * /api/v1/divisions/{id}:
 *   put:
 *     summary: Update a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "div_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Digital Marketing
 *               description:
 *                 type: string
 *                 example: Updated description for marketing division
 *     responses:
 *       200:
 *         description: Division updated successfully
 */
router.put("/:id", authenticate, adminMiddleware, validate(updateDivisionSchema), divisionController.updateDivision);

/**
 * @swagger
 * /api/v1/divisions/{id}:
 *   delete:
 *     summary: Delete a division
 *     tags: [Divisions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "div_123"
 *     responses:
 *       200:
 *         description: Division deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, divisionController.deleteDivision);

export default router;
