import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { AssignmentRepository } from "./assignment.repo.js";
import { AssignmentService } from "./assignment.service.js";
import { AssignmentController } from "./assignment.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../middleware/role.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../utils/validate.js";
import { createAssignmentSchema, updateAssignmentSchema } from "./assignment.schema.js";

/**
 * @swagger
 * tags:
 *   - name: Assignments
 *     description: Assignment management
 */

const router = Router();

// Inisialisasi OOP
const assignmentRepo = new AssignmentRepository(prisma);
const assignmentService = new AssignmentService(assignmentRepo);
const assignmentController = new AssignmentController(assignmentService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
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
 *         description: List of all assignments
 */
router.get("/", authenticate, assignmentController.getAllAssignments);

/**
 * @swagger
 * /api/v1/assignments/stats:
 *   get:
 *     summary: Get assignment statistics
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment statistics
 */
router.get("/stats", authenticate, assignmentController.getAssignmentStats);

/**
 * @swagger
 * /api/v1/assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "asn_123"
 *     responses:
 *       200:
 *         description: Assignment details
 */
router.get("/:id", authenticate, assignmentController.getAssignmentById);

/**
 * @swagger
 * /api/v1/assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - mentorId
 *               - title
 *               - submissionType
 *               - due_date
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               mentorId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               title:
 *                 type: string
 *                 example: "Project React Dasar"
 *               description:
 *                 type: string
 *                 example: "Buatlah aplikasi React sederhana menggunakan Vite"
 *               submissionType:
 *                 type: string
 *                 enum: [TEXT, FILE]
 *                 example: FILE
 *               attachmentUrl:
 *                 type: string
 *                 example: "https://example.com/template.zip"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-01T23:59:59Z"
 *     responses:
 *       201:
 *         description: Assignment created successfully
 */
router.post("/", authenticate, adminMiddleware, validate(createAssignmentSchema), assignmentController.createAssignment);

/**
 * @swagger
 * /api/v1/assignments/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "asn_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Project React Lanjutan"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-05-10T23:59:59Z"
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 */
router.put("/:id", authenticate, adminMiddleware, validate(updateAssignmentSchema), assignmentController.updateAssignment);

/**
 * @swagger
 * /api/v1/assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "asn_123"
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, assignmentController.deleteAssignment);

export default router;
