// src/modules/dailyJournal/dailyJournal.routes.ts
import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { DailyJournalRepo } from "./dailyJourney.repo.js";
import { DailyJournalService } from "./dailyJourney.service.js";
import { DailyJournalController } from "./dailyJorney.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { requireRoles } from "../../middleware/role.middleware.js";

/**
 * @swagger
 * tags:
 *   - name: DailyJournal
 *     description: Daily journal management
 */

const router = Router();
const repo = new DailyJournalRepo(prisma);
const service = new DailyJournalService(repo);
const controller = new DailyJournalController(service);

// Semua route di sini butuh login
router.use(authenticate);

/**
 * @swagger
 * /api/v1/daily-journal:
 *   get:
 *     summary: Get all daily journal entries
 *     tags: [DailyJournal]
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
 *         description: List of daily journal entries
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/v1/daily-journal/stats:
 *   get:
 *     summary: Get daily journal statistics
 *     tags: [DailyJournal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily journal statistics
 */
router.get("/stats", controller.getDailyJournalStats);

/**
 * @swagger
 * /api/v1/daily-journal/{id}:
 *   get:
 *     summary: Get a daily journal entry by ID
 *     tags: [DailyJournal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "dj_123"
 *     responses:
 *       200:
 *         description: Daily journal entry details
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/v1/daily-journal:
 *   post:
 *     summary: Create a new daily journal entry
 *     tags: [DailyJournal]
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
 *               - activity
 *               - date
 *             properties:
 *               santriId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               activity:
 *                 type: string
 *                 example: "Mempelajari React Hooks dan Context API"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-20T08:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "Sangat antusias mengikuti sesi."
 *     responses:
 *       201:
 *         description: Daily journal entry created
 */
router.post("/", requireRoles(["MENTOR", "ADMIN"]), controller.create);

/**
 * @swagger
 * /api/v1/daily-journal/{id}:
 *   put:
 *     summary: Update a daily journal entry
 *     tags: [DailyJournal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "dj_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity:
 *                 type: string
 *                 example: "Mempelajari Advanced React Hooks"
 *               notes:
 *                 type: string
 *                 example: "Sudah mulai memahami penggunaan useMemo."
 *     responses:
 *       200:
 *         description: Daily journal entry updated
 */
router.put("/:id", requireRoles(["MENTOR", "ADMIN"]), controller.update);

/**
 * @swagger
 * /api/v1/daily-journal/{id}:
 *   delete:
 *     summary: Delete a daily journal entry
 *     tags: [DailyJournal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "dj_123"
 *     responses:
 *       200:
 *         description: Daily journal entry deleted
 */
router.delete("/:id", requireRoles(["ADMIN"]), controller.delete);

export default router;