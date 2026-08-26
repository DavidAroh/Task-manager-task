/**
 * Main Entry Point - Bootstrap the NestJS application.
 *
 * NestJS Concepts Demonstrated:
 * - NestFactory.create() creates the application instance
 * - Global ValidationPipe enables DTO validation for all routes
 * - Global exception filter for consistent error responses
 * - CORS configuration
 * - Port configuration
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix: all routes will be prefixed with /api
  app.setGlobalPrefix('api');

  // Global ValidationPipe: auto-validates incoming request bodies against DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Strip unknown properties from request body
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true,            // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert query params to their types
      },
    }),
  );

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS for all origins (configure for production)
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Task Manager API is running on: http://localhost:${port}`);
  console.log(`API Base URL: http://localhost:${port}/api`);
  console.log(`Available Endpoints:`);
  console.log(`GET    /api/tasks          - List all tasks (with filters)`);
  console.log(`GET    /api/tasks/stats     - Get task statistics`);
  console.log(`GET    /api/tasks/:id       - Get a single task`);
  console.log(`POST   /api/tasks           - Create a new task`);
  console.log(`PATCH  /api/tasks/:id       - Update a task`);
  console.log(`   PATCH  /api/tasks/:id/status - Update task status`);
  console.log(`   DELETE /api/tasks/:id       - Delete a task`);
  console.log(`Try it with curl:`);
  console.log(`   curl http://localhost:${port}/api/tasks`);
  console.log(`   curl -X POST http://localhost:${port}/api/tasks \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"title": "My First Task", "description": "Learn NestJS"}'`);
}

bootstrap();
