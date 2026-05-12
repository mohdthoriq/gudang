import express, { type Application, type Request, type Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { requestLogger } from "./middleware/logging.middleware.js";
import { successResponse } from "./utils/response.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import authRouter from "./modules/auth/auth.router.js";
import divisionRouter from "./modules/divisions/division.route.js";
import classRouter from "./modules/classes/class.route.js";
import attendanceRouter from "./modules/attendance/attendance.route.js";
import assignmentRouter from "./modules/assignments/assignment.route.js";
import submissionRouter from "./modules/assignment-content/assignment-content.route.js";
import userRouter from "./modules/users/user/user.route.js";
import userProfileRouter from "./modules/users/profile/profile.route.js";
import waliSantriRouter from "./modules/wali/profileWali/waliProfile.route.js";
import relasiRouter from "./modules/wali/relasi/relation.route.js";
import dailyJournalRouter from "./modules/dailyJourney/dailyJourney.route.js";
import dailyScoreRouter from "./modules/score/score.route.js";

interface CustomRequest extends Request {
  rawBody?: string;
}

const app: Application = express();

app.use(
  express.json({
    verify: (req: CustomRequest, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.static('public'))
app.set('query parser', 'extended')
app.use(morgan('dev')) // Middleware logging HTTP request
// `morgan('dev')`: Middleware logging HTTP request. Format 'dev' memberikan output yang ringkas dan berwarna,
//                 sangat berguna saat pengembangan untuk melihat request yang masuk dan status responsnya.
app.use(helmet()) // Middleware keamanan header
// `helmet()`: Membantu mengamankan aplikasi Express dengan mengatur berbagai HTTP headers.
//             Ini melindungi dari beberapa kerentanan web yang diketahui seperti XSS.
app.use(cors()) // Middleware biar bisa di akses dari frontend
// `cors()`: Memungkinkan atau membatasi resource di server agar dapat diakses oleh domain lain (Cross-Origin Resource Sharing).
//           Sangat penting untuk API yang akan diakses oleh frontend dari domain berbeda.

app.use(requestLogger)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req: Request, res: Response) => {
    successResponse(res, "Welcome to the API", {
        message: "API is running",
        version: "1.0.0",
    });
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/divisions', divisionRouter)
app.use('/api/v1/classes', classRouter)
app.use('/api/v1/attendances', attendanceRouter)
app.use('/api/v1/assignments', assignmentRouter)
app.use('/api/v1/submissions', submissionRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/relasi', relasiRouter)
app.use('/api/v1/user-profile', userProfileRouter)
app.use('/api/v1/wali-santri', waliSantriRouter)
app.use('/api/v1/daily-journal', dailyJournalRouter)
app.use('/api/v1/monthly-evaluation', dailyScoreRouter)

app.get(/.*/, (req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
})

app.use(errorHandler);

export default app;
