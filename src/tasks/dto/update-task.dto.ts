/**
 * UpdateTaskDto - Data Transfer Object for updating an existing task.
 *
 * All fields are optional (PATCH semantics):
 * Only the fields included in the request body will be updated.
 *
 * NestJS Concepts Demonstrated:
 * - PartialType pattern (all fields optional for PATCH)
 * - Swagger/OpenAPI-ready DTOs
 */

import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../task.entity';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsEnum(TaskStatus, { message: 'Status must be OPEN, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  @IsOptional()
  priority?: TaskPriority;
}
