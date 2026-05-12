// src/modules/monthlyEvaluation/monthlyEvaluation.routes.ts
import { Router } from "express";
import { MonthlyEvaluationController } from "./score.controller.js"; // Sesuaikan nama file jika beda
import { MonthlyEvaluationService } from "./score.service.js";
import { MonthlyEvaluationRepo } from "./score.repo.js";
import { prisma } from "../../config/prisma.js"; // Sesuaikan path config prisma kamu
import { authenticate } from "../../middleware/auth.middleware.js"; // Sesuaikan middleware kamu
import { requireRoles } from "../../middleware/role.middleware.js";

const router = Router();

// Dependency Injection
const repo = new MonthlyEvaluationRepo(prisma);
const service = new MonthlyEvaluationService(repo);
const controller = new MonthlyEvaluationController(service);

/**
 * @swagger
 * tags:
 *   - name: MonthlyEvaluation
 *     description: Monthly evaluation and scoring management
 */

// Routes
/**
 * @swagger
 * /api/v1/monthly-evaluation:
 *   get:
 *     summary: Get all monthly evaluations
 *     tags: [MonthlyEvaluation]
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
 *         description: List of all monthly evaluations
 */
router.get("/", authenticate, controller.getAll);

/**
 * @swagger
 * /api/v1/monthly-evaluation/stats:
 *   get:
 *     summary: Get monthly evaluation statistics
 *     tags: [MonthlyEvaluation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly evaluation statistics
 */
router.get("/stats", authenticate, controller.getMonthlyEvaluationStats);

/**
 * @swagger
 * /api/v1/monthly-evaluation/{id}:
 *   get:
 *     summary: Get monthly evaluation by ID
 *     tags: [MonthlyEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "eval_123"
 *     responses:
 *       200:
 *         description: Monthly evaluation details
 */
router.get("/:id", authenticate, controller.getById);

// Hanya Mentor dan Admin yang boleh input/ubah nilai evaluasi
/**
 * @swagger
 * /api/v1/monthly-evaluation:
 *   post:
 *     summary: Create a new monthly evaluation
 *     tags: [MonthlyEvaluation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - santriId
 *               - classId
 *               - month
 *               - year
 *             properties:
 *               santriId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               month:
 *                 type: number
 *                 example: 4
 *               year:
 *                 type: number
 *                 example: 2024
 *               taskAvg:
 *                 type: number
 *                 example: 85.5
 *               attendancePoin:
 *                 type: number
 *                 example: 18
 *               maxAttendPoin:
 *                 type: number
 *                 example: 20
 *               attitudeAvg:
 *                 type: number
 *                 example: 90
 *               notes:
 *                 type: string
 *                 example: "Sangat baik dalam pengerjaan tugas."
 *     responses:
 *       201:
 *         description: Evaluation created successfully
 */
router.post("/", authenticate, requireRoles(["MENTOR", "ADMIN"]), controller.create);

/**
 * @swagger
 * /api/v1/monthly-evaluation/{id}:
 *   put:
 *     summary: Update a monthly evaluation
 *     tags: [MonthlyEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "eval_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskAvg:
 *                 type: number
 *                 example: 88
 *               attendancePoin:
 *                 type: number
 *                 example: 19
 *               attitudeAvg:
 *                 type: number
 *                 example: 92
 *               notes:
 *                 type: string
 *                 example: "Ada peningkatan di poin kehadiran."
 *     responses:
 *       200:
 *         description: Evaluation updated successfully
 */
router.put("/:id", authenticate, requireRoles(["MENTOR", "ADMIN"]), controller.update);

/**
 * @swagger
 * /api/v1/monthly-evaluation/{id}:
 *   delete:
 *     summary: Delete a monthly evaluation
 *     tags: [MonthlyEvaluation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "eval_123"
 *     responses:
 *       200:
 *         description: Evaluation deleted successfully
 */
router.delete("/:id", authenticate, requireRoles(["ADMIN"]), controller.delete);

export default router;
