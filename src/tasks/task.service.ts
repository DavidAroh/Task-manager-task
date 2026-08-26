/**
 * TaskService - Business logic layer for Task operations.
 *
 * NestJS Concepts Demonstrated:
 * - @Injectable() decorator marks this as a service that can be dependency-injected
 * - Services encapsulate business logic, separated from HTTP concerns
 * - In-memory storage (Map) as a simple data store
 *
 * REST API Concepts Demonstrated:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Filtering and pagination logic
 * - Proper error handling with NotFoundException
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto } from './dto';

@Injectable()
export class TaskService {
  // In-memory storage — in production, replace with a database repository
  private tasks: Map<string, Task> = new Map();

  /**
   * GET /tasks
   * Retrieve all tasks with optional filtering, sorting, and pagination.
   */
  findAll(query: QueryTaskDto): {
    data: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    let tasks = Array.from(this.tasks.values());

    // Filter by status
    if (query.status) {
      tasks = tasks.filter((t) => t.status === query.status);
    }

    // Filter by priority
    if (query.priority) {
      tasks = tasks.filter((t) => t.priority === query.priority);
    }

    // Search by title or description
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower),
      );
    }

    // Sorting
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';
    tasks.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal instanceof Date && bVal instanceof Date) {
        return order === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = tasks.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = tasks.slice(start, start + limit);

    return { data, total, page, limit, totalPages };
  }

  /**
   * GET /tasks/:id
   * Retrieve a single task by its ID.
   */
  findOne(id: string): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  /**
   * POST /tasks
   * Create a new task.
   */
  create(createTaskDto: CreateTaskDto): Task {
    const now = new Date();
    const task: Task = {
      id: uuidv4(),
      title: createTaskDto.title,
      description: createTaskDto.description || '',
      status: createTaskDto.status || TaskStatus.OPEN,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * PATCH /tasks/:id
   * Update an existing task (partial update).
   */
  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // Only update fields that are provided
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }
    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority;
    }

    task.updatedAt = new Date();
    this.tasks.set(id, task);
    return task;
  }

  /**
   * DELETE /tasks/:id
   * Delete a task by its ID.
   */
  remove(id: string): { message: string } {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.tasks.delete(id);
    return { message: `Task "${task.title}" has been deleted successfully` };
  }

  /**
   * GET /tasks/stats
   * Get task statistics — demonstrates a custom route.
   */
  getStats(): {
    total: number;
    open: number;
    inProgress: number;
    done: number;
    byPriority: Record<TaskPriority, number>;
  } {
    const tasks = Array.from(this.tasks.values());
    return {
      total: tasks.length,
      open: tasks.filter((t) => t.status === TaskStatus.OPEN).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
        .length,
      done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
      byPriority: {
        [TaskPriority.LOW]: tasks.filter((t) => t.priority === TaskPriority.LOW)
          .length,
        [TaskPriority.MEDIUM]: tasks.filter(
          (t) => t.priority === TaskPriority.MEDIUM,
        ).length,
        [TaskPriority.HIGH]: tasks.filter(
          (t) => t.priority === TaskPriority.HIGH,
        ).length,
      },
    };
  }

  /**
   * PATCH /tasks/:id/status
   * Update only the status of a task — demonstrates nested route.
   */
  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    task.status = status;
    task.updatedAt = new Date();
    this.tasks.set(id, task);
    return task;
  }
}
