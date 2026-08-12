import { expect, test, type APIRequestContext } from '@playwright/test';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from './types';

/**
 * Task Management API — Playwright API test boilerplate
 *
 * Endpoints under test:
 *   POST   /tasks       Create a new task
 *   GET    /tasks/{id}  Retrieve a task by ID
 *   PUT    /tasks/{id}  Update a task by ID
 *   DELETE /tasks/{id}  Delete a task by ID
 *
 * Expected status codes (happy path):
 *   POST   → 201 Created
 *   GET    → 200 OK
 *   PUT    → 200 OK
 *   DELETE → 204 No Content
 *
 * Common error cases:
 *   400 Bad Request  — invalid / missing payload
 *   404 Not Found    — unknown task id
 *
 * No API server is shipped with this repo. Point baseURL at your service
 * (default http://localhost:3000) and run:
 *   npm.cmd run e2e:api
 */

const TASKS_PATH = '/tasks';

function authHeaders(): Record<string, string> {
  // Placeholder — replace when the API requires auth.
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Authorization: `Bearer ${process.env.API_TOKEN}`,
  };
}

async function createTask(
  request: APIRequestContext,
  body: CreateTaskRequest,
): Promise<{ response: Awaited<ReturnType<APIRequestContext['post']>>; task: Task }> {
  const response = await request.post(TASKS_PATH, {
    headers: authHeaders(),
    data: body,
  });
  const task = (await response.json()) as Task;
  return { response, task };
}

test.describe('Task Management API', () => {
  test.describe('POST /tasks — create a new task', () => {
    test('creates a task and returns 201 with the created resource', async ({ request }) => {
      const payload: CreateTaskRequest = {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread',
        status: 'todo',
      };

      const response = await request.post(TASKS_PATH, {
        headers: authHeaders(),
        data: payload,
      });

      // Expected: 201 Created
      expect(response.status()).toBe(201);

      const body = (await response.json()) as Task;
      expect(body).toMatchObject({
        title: payload.title,
        description: payload.description,
        status: payload.status,
      });
      expect(body.id).toEqual(expect.any(String));
      expect(body.createdAt).toEqual(expect.any(String));
      expect(body.updatedAt).toEqual(expect.any(String));
    });

    test('returns 400 when title is missing', async ({ request }) => {
      const response = await request.post(TASKS_PATH, {
        headers: authHeaders(),
        data: { description: 'Missing title' },
      });

      // Expected: 400 Bad Request
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body).toHaveProperty('message');
    });
  });

  test.describe('GET /tasks/{id} — retrieve a task by ID', () => {
    test('returns 200 and the task payload for an existing id', async ({ request }) => {
      const { task: created } = await createTask(request, {
        title: 'Read API docs',
        status: 'todo',
      });

      const response = await request.get(`${TASKS_PATH}/${created.id}`, {
        headers: authHeaders(),
      });

      // Expected: 200 OK
      expect(response.status()).toBe(200);

      const body = (await response.json()) as Task;
      expect(body).toMatchObject({
        id: created.id,
        title: 'Read API docs',
        status: 'todo',
      });
    });

    test('returns 404 for an unknown task id', async ({ request }) => {
      const response = await request.get(`${TASKS_PATH}/non-existent-id`, {
        headers: authHeaders(),
      });

      // Expected: 404 Not Found
      expect(response.status()).toBe(404);
    });
  });

  test.describe('PUT /tasks/{id} — update a task by ID', () => {
    test('updates fields and returns 200 with the updated resource', async ({ request }) => {
      const { task: created } = await createTask(request, {
        title: 'Draft report',
        status: 'todo',
      });

      const update: UpdateTaskRequest = {
        title: 'Finalize report',
        status: 'in_progress',
        description: 'Include Q1 metrics',
      };

      const response = await request.put(`${TASKS_PATH}/${created.id}`, {
        headers: authHeaders(),
        data: update,
      });

      // Expected: 200 OK
      expect(response.status()).toBe(200);

      const body = (await response.json()) as Task;
      expect(body).toMatchObject({
        id: created.id,
        title: update.title,
        status: update.status,
        description: update.description,
      });
      expect(body.updatedAt).not.toBe(created.updatedAt);
    });

    test('returns 404 when updating a missing task', async ({ request }) => {
      const response = await request.put(`${TASKS_PATH}/non-existent-id`, {
        headers: authHeaders(),
        data: { title: 'Does not matter' } satisfies UpdateTaskRequest,
      });

      // Expected: 404 Not Found
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /tasks/{id} — delete a task by ID', () => {
    test('deletes the task and returns 204 No Content', async ({ request }) => {
      const { task: created } = await createTask(request, {
        title: 'Temporary task',
        status: 'todo',
      });

      const deleteResponse = await request.delete(`${TASKS_PATH}/${created.id}`, {
        headers: authHeaders(),
      });

      // Expected: 204 No Content (empty body)
      expect(deleteResponse.status()).toBe(204);
      expect(await deleteResponse.text()).toBe('');

      const getResponse = await request.get(`${TASKS_PATH}/${created.id}`, {
        headers: authHeaders(),
      });
      expect(getResponse.status()).toBe(404);
    });

    test('returns 404 when deleting a missing task', async ({ request }) => {
      const response = await request.delete(`${TASKS_PATH}/non-existent-id`, {
        headers: authHeaders(),
      });

      // Expected: 404 Not Found
      expect(response.status()).toBe(404);
    });
  });
});
