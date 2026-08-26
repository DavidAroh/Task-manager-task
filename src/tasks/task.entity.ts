/**
 * Task Entity
 *
 * Represents a single task in the Task Manager.
 * This is an in-memory model (no database) for demonstration purposes.
 *
 * REST API Concepts Demonstrated:
 * - Resource modeling (a Task is a REST resource)
 * - Status field for task lifecycle management
 */

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}
