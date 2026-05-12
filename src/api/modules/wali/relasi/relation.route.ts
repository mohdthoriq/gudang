import { Router } from "express";
import { prisma } from "../../../config/prisma.js";
import { WaliRelationRepository } from "./relation.repo.js";
import { WaliRelationService } from "./relation.service.js";
import { WaliRelationController } from "./relation.controller.js";

// Middlewares
import { adminMiddleware } from "../../../middleware/role.middleware.js";
import { createWaliRelationSchema, updateWaliRelationSchema } from "./relation.schema.js";
import { validate } from "../../../utils/validate.js";

/**
 * @swagger
 * tags:
 *   - name: WaliRelations
 *     description: Relationship management between Wali and Santri
 */

const router = Router();

// Dependency Injection Setup
const repo = new WaliRelationRepository(prisma);
const service = new WaliRelationService(repo);
const controller = new WaliRelationController(service);

/**
 * @swagger
 * /api/v1/relasi:
 *   get:
 *     summary: Get all wali-santri relations
 *     tags: [WaliRelations]
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
 *         description: List of all relations
 */
router.get("/", adminMiddleware, controller.getAllRelations);

/**
 * @swagger
 * /api/v1/relasi/stats:
 *   get:
 *     summary: Get statistics of all relations
 *     tags: [WaliRelations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics of all relations
 */
router.get("/stats", adminMiddleware, controller.getRelationStats);

// Tidak perlu multer, langsung validate JSON menggunakan Zod
/**
 * @swagger
 * /api/v1/relasi:
 *   post:
 *     summary: Create a new relation
 *     tags: [WaliRelations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - waliId
 *               - santriId
 *               - category
 *             properties:
 *               waliId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440003"
 *               santriId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               category:
 *                 type: string
 *                 enum: [FATHER, MOTHER, GUARDIAN, OTHER]
 *                 example: FATHER
 *     responses:
 *       201:
 *         description: Relation created successfully
 */
router.post(
  "/", 
  adminMiddleware, 
  validate(createWaliRelationSchema), 
  controller.createRelation
);

/**
 * @swagger
 * /api/v1/relasi/{id}:
 *   put:
 *     summary: Update a relation
 *     tags: [WaliRelations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "rel_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [FATHER, MOTHER, GUARDIAN, OTHER]
 *                 example: GUARDIAN
 *     responses:
 *       200:
 *         description: Relation updated successfully
 */
router.put(
  "/:id", 
  adminMiddleware, 
  validate(updateWaliRelationSchema), 
  controller.updateRelation
);

/**
 * @swagger
 * /api/v1/relasi/{id}:
 *   delete:
 *     summary: Delete a relation
 *     tags: [WaliRelations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "rel_123"
 *     responses:
 *       200:
 *         description: Relation deleted successfully
 */
router.delete("/:id", adminMiddleware, controller.deleteRelation);

export default router;