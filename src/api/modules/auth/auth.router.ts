import { Router } from "express";
import { registerController } from "./register/register.controller.js";
import { loginController, refreshTokenController } from "./login/login.controller.js";
import { validate } from "../../utils/validate.js";
import { registerSchema } from "./register/register.schema.js";
import { loginSchema } from "./login/login.schema.js";
import { resendOtpController, verifyOtpController } from "./email/otp.controller.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */
const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *               - phone
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
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", validate(registerSchema), registerController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: muhammad@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", validate(loginSchema), loginController);

// TODO: Implement these controllers
/**
 * @swagger
 * /api/v1/auth/send-otp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: muhammad@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", resendOtpController);
/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - otp
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "UUID user"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOtpController);
/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh-token", refreshTokenController);
// router.post("/forgot-password", forgotPasswordController);
// router.post("/reset-password", resetPasswordController);
// router.delete("/logout", logoutController);

export default router;