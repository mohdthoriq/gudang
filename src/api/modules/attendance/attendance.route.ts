import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { AttendanceRepository } from "./attendance.repo.js";
import { AttendanceService } from "./attendance.service.js";
import { AttendanceController } from "./attendance.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../middleware/role.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../utils/validate.js";
import { markAttendanceSchema, updateAttendanceSchema } from "./attendance.schema.js";

/**
 * @swagger
 * tags:
 *   - name: Attendances
 *     description: Attendance management
 */

const router = Router();

// Inisialisasi OOP
const attendanceRepo = new AttendanceRepository(prisma);
const attendanceService = new AttendanceService(attendanceRepo);
const attendanceController = new AttendanceController(attendanceService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/attendances:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendances]
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
 *         description: List of attendance records
 */
router.get("/", authenticate, attendanceController.getAllAttendances);

/**
 * @swagger
 * /api/v1/attendances/stats:
 *   get:
 *     summary: Get attendance statistics
 *     tags: [Attendances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance statistics
 */
router.get("/stats", authenticate, attendanceController.getAttendanceStats);

/**
 * @swagger
 * /api/v1/attendances/{id}:
 *   get:
 *     summary: Get attendance record by ID
 *     tags: [Attendances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "att_123"
 *     responses:
 *       200:
 *         description: Attendance record details
 */
router.get("/:id", authenticate, attendanceController.getAttendanceById);

/**
 * @swagger
 * /api/v1/attendances:
 *   post:
 *     summary: Mark attendance
 *     tags: [Attendances]
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
 *               - santriId
 *               - mentorId
 *               - date
 *               - status
 *             properties:
 *               classId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               santriId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               mentorId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-18T08:00:00Z"
 *               status:
 *                 type: string
 *                 enum: [HADIR, SAKIT, IZIN, ALFA]
 *                 example: HADIR
 *               notes:
 *                 type: string
 *                 example: Hadir tepat waktu
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/attendance.jpg"
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 */
router.post("/", authenticate, adminMiddleware, validate(markAttendanceSchema), attendanceController.markAttendance);

/**
 * @swagger
 * /api/v1/attendances/{id}:
 *   put:
 *     summary: Update attendance record
 *     tags: [Attendances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "att_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [HADIR, SAKIT, IZIN, ALFA]
 *                 example: SAKIT
 *               notes:
 *                 type: string
 *                 example: Izin karena sakit
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/mc.jpg"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-04-18T08:00:00Z"
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 */
router.put("/:id", authenticate, adminMiddleware, validate(updateAttendanceSchema), attendanceController.updateAttendance);

/**
 * @swagger
 * /api/v1/attendances/{id}:
 *   delete:
 *     summary: Delete attendance record
 *     tags: [Attendances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "att_123"
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, attendanceController.deleteAttendance);

export default router;
