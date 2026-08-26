/**
 * TaskModule - Feature module for Task management.
 *
 * NestJS Concepts Demonstrated:
 * - Modules are the fundamental organizational unit in NestJS
 * - Each module encapsulates a set of related functionality
 * - Providers (services) declared in this module are available for DI
 * - Controllers handle incoming HTTP requests
 * - Imports array would include other modules this module depends on
 */

import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export so other modules can use TaskService
})
export class TaskModule {}
