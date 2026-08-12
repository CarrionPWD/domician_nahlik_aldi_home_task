/**
 * Shared types for the Task Management REST API test suite.
 * No backend is implemented in this project — these mirror the expected contract.
 */

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
