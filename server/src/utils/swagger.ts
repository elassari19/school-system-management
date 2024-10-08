import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Restfull API with Swagger',
      version,
      description:
        'LMS application made with Express and documented with Swagger',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
      security: {
        bearerAuth: [],
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/v1/api',
      },
    ],
  },
  apis: [`**/*.route.ts`, '**/*.yaml'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app: Express, port: number) => {
  // swagger pages
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // swagger json format
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger running on http://localhost:${port}/docs`);
};

export default swaggerDocs;
