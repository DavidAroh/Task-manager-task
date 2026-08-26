/**
 * QueryTaskDto - DTO for validating query parameters.
 *
 * REST API Concepts Demonstrated:
 * - Query parameters for filtering, sorting, and pagination
 * - Optional parameters with defaults
 */

import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, TaskPriority } from '../task.entity';

export class QueryTaskDto {
  @IsEnum(TaskStatus, { message: 'Status filter must be OPEN, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority filter must be LOW, MEDIUM, or HIGH' })
  @IsOptional()
  priority?: TaskPriority;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'status';

  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
