/**
 * UpdateStatusDto - DTO for updating just the task status.
 */

import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateStatusDto {
  @IsEnum(TaskStatus, { message: 'Status must be OPEN, IN_PROGRESS, or DONE' })
  @IsNotEmpty({ message: 'Status is required' })
  status: TaskStatus;
}
