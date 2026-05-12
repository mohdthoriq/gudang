import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { ClassRepository } from "./class.repo.js";
import { ClassService } from "./class.service.js";
import { ClassController } from "./class.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../middleware/role.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../utils/validate.js";
import { createClassSchema, updateClassSchema } from "./class.schema.js";

/**
 * @swagger
 * tags:
 *   - name: Classes
 *     description: Class management
 */

const router = Router();

// Inisialisasi OOP
const classRepo = new ClassRepository(prisma);
const classService = new ClassService(classRepo);
const classController = new ClassController(classService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
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
 *         description: List of all classes
 */
router.get("/", authenticate, classController.getAllClasses);

/**
 * @swagger
 * /api/v1/classes/stats:
 *   get:
 *     summary: Get class statistics
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Class statistics
 */
router.get("/stats", authenticate, classController.getClassStats);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "class_123"
 *     responses:
 *       200:
 *         description: Class details
 *       404:
 *         description: Class not found
 */
router.get("/:id", authenticate, classController.getClassById);

/**
 * @swagger
 * /api/v1/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
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
 *               - divisiId
 *               - mentorId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Web Development Class A
 *               divisiId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               mentorId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       201:
 *         description: Class created successfully
 */
router.post("/", authenticate, adminMiddleware, validate(createClassSchema), classController.createClass);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "class_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mobile Development Class B
 *               divisiId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               mentorId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Class updated successfully
 */
router.put("/:id", authenticate, adminMiddleware, validate(updateClassSchema), classController.updateClass);

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "class_123"
 *     responses:
 *       200:
 *         description: Class deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, classController.deleteClass);

export default router;
