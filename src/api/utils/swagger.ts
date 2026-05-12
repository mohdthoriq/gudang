import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIMAK Web API Documentation',
      version: '1.0.0',
      description: 'API documentation for SIMAK Web Application (Sistem Informasi Manajemen Aktivitas Santri)',
      contact: {
        name: 'Developer',
        email: 'muhammad@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT || 3000}`,
        description: 'Development server',
      },
      {
        url: '/',
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Unauthorized access' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Look for annotations in these files
  apis: ['./src/modules/**/*.ts', './src/modules/**/*.router.ts', './src/modules/**/*.route.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
