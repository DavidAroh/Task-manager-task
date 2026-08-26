/**
 * AppModule - Root application module.
 *
 * NestJS Concepts Demonstrated:
 * - Root module bootstraps the application
 * - Imports array brings in feature modules
 * - The root module should be minimal — delegate to feature modules
 */

import { Module } from '@nestjs/common';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [TaskModule],
})
export class AppModule {}
