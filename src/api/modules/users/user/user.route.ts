import { Router } from "express";
import { prisma } from "../../../config/prisma.js";
import { UserRepository } from "./user.repo.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";

// Impor middleware dan validasi
import { adminMiddleware } from "../../../middleware/role.middleware.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../utils/validate.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

const router = Router();

// Inisialisasi OOP
const userRepo = new UserRepository(prisma);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// --- ROUTES ---

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: List of all users
 */
router.get("/", authenticate, adminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/stats:
 *   get:
 *     summary: Get statistics of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics of all users
 */
router.get("/stats", authenticate, adminMiddleware, userController.getStats);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user (Admin Only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/", authenticate, adminMiddleware, validate(createUserSchema), userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/:id", authenticate, userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "user_123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Muhammad Rizki Updated
 *               email:
 *                 type: string
 *                 example: muhammad_updated@gmail.com
 *               phone:
 *                 type: string
 *                 example: "08987654321"
 *               role:
 *                 type: string
 *                 enum: [SANTRI, MENTOR, WALI_SANTRI]
 *                 example: SANTRI
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/:id", authenticate, validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "user_123"
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:id", authenticate, adminMiddleware, userController.deleteUser);

export default router;
