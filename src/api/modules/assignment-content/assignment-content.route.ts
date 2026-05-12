import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { AssignmentContentRepository } from "./assignment-content.repo.js";
import { AssignmentContentService } from "./assignment-content.service.js";
import { AssignmentContentController } from "./assignment-content.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../middleware/role.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../utils/validate.js";
import { submitAssignmentSchema, gradeSubmissionSchema } from "./assignment-content.schema.js";

/**
 * @swagger
 * tags:
 *   - name: AssignmentSubmissions
 *     description: Assignment submission and grading management
 */

const router = Router();

// Inisialisasi OOP
const submissionRepo = new AssignmentContentRepository(prisma);
const submissionService = new AssignmentContentService(submissionRepo);
const submissionController = new AssignmentContentController(submissionService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/submissions:
 *   get:
 *     summary: Get all submissions
 *     tags: [AssignmentSubmissions]
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
 *         description: List of all submissions
 */
router.get("/", authenticate, submissionController.getSubmissions);

/**
 * @swagger
 * /api/v1/submissions/stats:
 *   get:
 *     summary: Get submission statistics
 *     tags: [AssignmentSubmissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Submission statistics
 */
router.get("/stats", authenticate, submissionController.getSubmissionsStats);

/**
 * @swagger
 * /api/v1/submissions/{id}:
 *   get:
 *     summary: Get submission by ID
 *     tags: [AssignmentSubmissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "sub_123"
 *     responses:
 *       200:
 *         description: Submission details
 */
router.get("/:id", authenticate, submissionController.getSubmissionById);

/**
 * @swagger
 * /api/v1/submissions:
 *   post:
 *     summary: Submit an assignment
 *     tags: [AssignmentSubmissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *               - santriId
 *               - contentType
 *               - fileUrl
 *             properties:
 *               assignmentId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               santriId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               contentType:
 *                 type: string
 *                 enum: [VIDEO, FOTO, TEXT]
 *                 example: FOTO
 *               fileUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/submission.jpg"]
 *     responses:
 *       201:
 *         description: Assignment submitted successfully
 */
router.post("/", authenticate, validate(submitAssignmentSchema), submissionController.submitAssignment);

/**
 * @swagger
 * /api/v1/submissions/{id}:
 *   put:
 *     summary: Grade a submission
 *     tags: [AssignmentSubmissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "sub_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 example: 95
 *               mentorFeedback:
 *                 type: string
 *                 example: "Kerja bagus! Detailnya sangat lengkap."
 *               status:
 *                 type: string
 *                 enum: [PENDING, GRADED]
 *                 example: GRADED
 *     responses:
 *       200:
 *         description: Submission graded successfully
 */
router.put("/:id", authenticate, adminMiddleware, validate(gradeSubmissionSchema), submissionController.gradeSubmission);

/**
 * @swagger
 * /api/v1/submissions/{id}:
 *   delete:
 *     summary: Delete a submission
 *     tags: [AssignmentSubmissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "sub_123"
 *     responses:
 *       200:
 *         description: Submission deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, submissionController.deleteSubmission);

export default router;
