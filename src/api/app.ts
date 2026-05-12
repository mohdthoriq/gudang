import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { requestLogger } from "./middleware/logging.middleware.js";
import { successResponse } from "./utils/response.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';
import { errorHandler } from "./middleware/errorHandler.middleware.js";

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


app.get(/.*/, (req: Request, res: Response) => {
  throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
})

app.use(errorHandler);

export default app;
