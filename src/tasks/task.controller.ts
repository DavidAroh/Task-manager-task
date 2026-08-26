/**
 * TaskController - HTTP layer handling REST API endpoints.
 *
 * REST API Concepts Demonstrated:
 * - HTTP Methods: GET (read), POST (create), PATCH (update), DELETE (remove)
 * - Status Codes: 200 OK, 201 Created, 204 No Content, 404 Not Found
 * - Route Parameters: @Param('id') for /tasks/:id
 * - Query Parameters: @Query() for /tasks?status=OPEN&page=1
 * - Request Body: @Body() for POST/PATCH payloads
 * - Proper HTTP semantics (RESTful routing)
 *
 * NestJS Concepts Demonstrated:
 * - @Controller('tasks') defines the route prefix
 * - @Injectable service injected via constructor (Dependency Injection)
 * - Decorator-based routing (@Get, @Post, @Patch, @Delete)
 * - @HttpCode for explicit status codes
 * - @Param, @Query, @Body parameter decorators
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, QueryTaskDto, UpdateStatusDto } from './dto';

@Controller('tasks')
export class TaskController {
  // Dependency Injection: TaskService is injected automatically by NestJS
  constructor(private readonly taskService: TaskService) {}

  /**
   * GET /tasks
   *
   * Retrieve all tasks with optional filtering, sorting, and pagination.
   *
   * Query Parameters:
   *   - status: Filter by task status (OPEN | IN_PROGRESS | DONE)
   *   - priority: Filter by priority (LOW | MEDIUM | HIGH)
   *   - search: Search in title and description
   *   - sortBy: Sort field (createdAt | updatedAt | title | priority | status)
   *   - order: Sort direction (asc | desc)
   *   - page: Page number (default: 1)
   *   - limit: Items per page (default: 10, max: 100)
   *
   * HTTP Status: 200 OK
   */
  @Get()
  findAll(@Query() query: QueryTaskDto) {
    return this.taskService.findAll(query);
  }

  /**
   * GET /tasks/stats
   *
   * Get task statistics — total count, counts by status and priority.
   *
   * HTTP Status: 200 OK
   *
   * NOTE: This route must be defined BEFORE /tasks/:id to avoid
   * "stats" being captured as a UUID parameter.
   */
  @Get('stats')
  getStats() {
    return this.taskService.getStats();
  }

  /**
   * GET /tasks/:id
   *
   * Retrieve a single task by its UUID.
   *
   * Route Parameter:
   *   - id: The task UUID (validated as UUID automatically)
   *
   * HTTP Status: 200 OK | 404 Not Found
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  /**
   * POST /tasks
   *
   * Create a new task.
   *
   * Request Body (JSON):
   *   - title: string (required)
   *   - description: string (optional)
   *   - status: TaskStatus (optional, default: OPEN)
   *   - priority: TaskPriority (optional, default: MEDIUM)
   *
   * HTTP Status: 201 Created | 400 Bad Request (validation errors)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * PATCH /tasks/:id
   *
   * Partially update an existing task.
   * Only the fields included in the request body will be updated.
   *
   * Route Parameter:
   *   - id: The task UUID
   *
   * Request Body (JSON): Any subset of { title, description, status, priority }
   *
   * HTTP Status: 200 OK | 404 Not Found | 400 Bad Request (validation errors)
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  /**
   * PATCH /tasks/:id/status
   *
   * Update only the status of a task.
   * Demonstrates a nested/nested-action route.
   *
   * Route Parameter:
   *   - id: The task UUID
   *
   * Request Body (JSON):
   *   - status: TaskStatus (required)
   *
   * HTTP Status: 200 OK | 404 Not Found | 400 Bad Request
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.taskService.updateStatus(id, updateStatusDto.status);
  }

  /**
   * DELETE /tasks/:id
   *
   * Delete a task by its ID.
   *
   * Route Parameter:
   *   - id: The task UUID
   *
   * HTTP Status: 200 OK (with message) | 404 Not Found
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(id);
  }
}
