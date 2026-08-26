# 🚀 Task Manager REST API — NestJS

A complete **Task Manager REST API** built with NestJS, demonstrating REST API principles, HTTP methods, status codes, route/query parameters, NestJS architecture, dependency injection, DTOs, and request validation.

## 📁 Project Structure

```
src/
├── main.ts                          # App entry point (bootstrap, global config)
├── app.module.ts                    # Root module
├── filters/
│   └── http-exception.filter.ts     # Global exception filter (consistent errors)
└── tasks/
    ├── task.entity.ts               # Task model (interface + enums)
    ├── task.module.ts               # Feature module (wires controller + service)
    ├── task.controller.ts           # HTTP layer (routes, status codes, params)
    ├── task.service.ts              # Business logic (CRUD, filtering, pagination)
    └── dto/
        ├── index.ts                 # Re-exports
        ├── create-task.dto.ts       # Validation for POST /tasks
        ├── update-task.dto.ts       # Validation for PATCH /tasks/:id
        ├── update-status.dto.ts     # Validation for PATCH /tasks/:id/status
        └── query-task.dto.ts        # Validation for GET /tasks query params
```

## 🛠 Setup & Run

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm run start

# Start in development mode (watch)
npm run start:dev
```

## 📡 API Endpoints

| Method   | Endpoint               | Description                | Status Codes            |
|----------|------------------------|----------------------------|-------------------------|
| `GET`    | `/api/tasks`           | List all tasks             | `200 OK`                |
| `GET`    | `/api/tasks/stats`     | Get task statistics        | `200 OK`                |
| `GET`    | `/api/tasks/:id`       | Get a single task          | `200 OK` / `404 Not Found` |
| `POST`   | `/api/tasks`           | Create a new task          | `201 Created` / `400 Bad Request` |
| `PATCH`  | `/api/tasks/:id`       | Update a task (partial)    | `200 OK` / `404 Not Found` |
| `PATCH`  | `/api/tasks/:id/status`| Update task status only    | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/tasks/:id`       | Delete a task              | `200 OK` / `404 Not Found` |

## 🧪 Usage Examples

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn NestJS",
    "description": "Complete the NestJS tutorial",
    "priority": "HIGH"
  }'
```

### List All Tasks (with filters)
```bash
# All tasks
curl http://localhost:3000/api/tasks

# Filter by status
curl "http://localhost:3000/api/tasks?status=OPEN"

# Filter by priority
curl "http://localhost:3000/api/tasks?priority=HIGH"

# Search
curl "http://localhost:3000/api/tasks?search=nest"

# Pagination
curl "http://localhost:3000/api/tasks?page=1&limit=5"

# Sort
curl "http://localhost:3000/api/tasks?sortBy=priority&order=asc"
```

### Get a Single Task
```bash
curl http://localhost:3000/api/tasks/{task-id}
```

### Update a Task
```bash
curl -X PATCH http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{"status": "DONE"}'
```

### Update Task Status
```bash
curl -X PATCH http://localhost:3000/api/tasks/{task-id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'
```

### Delete a Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

### Get Statistics
```bash
curl http://localhost:3000/api/tasks/stats
```

## 📚 Concepts Demonstrated

### REST API Principles
- **Resources**: Tasks are identified by UUIDs (`/api/tasks/:id`)
- **Stateless**: Each request contains all info needed to process it
- **Uniform Interface**: Consistent URL patterns and HTTP methods
- **Proper HTTP Methods**: GET (read), POST (create), PATCH (update), DELETE (remove)
- **Status Codes**: 200, 201, 400, 404 used appropriately

### NestJS Architecture
- **Modules**: `TaskModule` encapsulates task-related code
- **Controllers**: `TaskController` handles HTTP concerns (routes, params, status codes)
- **Services**: `TaskService` contains business logic (CRUD, filtering, pagination)
- **Dependency Injection**: Service is injected into the controller via constructor
- **DTOs**: Data Transfer Objects define and validate request/response shapes
- **Exception Filters**: Global filter for consistent error response format

### HTTP Methods & Status Codes
| Method | Purpose           | Success Code  |
|--------|-------------------|---------------|
| GET    | Read resource(s)  | 200 OK        |
| POST   | Create resource   | 201 Created   |
| PATCH  | Update resource   | 200 OK        |
| DELETE | Remove resource   | 200 OK        |

### Route & Query Parameters
- **Route Parameters**: `:id` for identifying specific resources
- **Query Parameters**: `?status=OPEN&page=1&limit=10` for filtering/pagination
- **Validation**: `ParseUUIDPipe` validates route params; `ValidationPipe` validates query params

### DTOs & Validation
- **class-validator** decorators: `@IsString`, `@IsEnum`, `@IsNotEmpty`, `@MaxLength`
- **class-transformer**: Auto-transforms and type-converts request data
- **Global ValidationPipe**: Applies validation to all incoming requests
- **Whitelist mode**: Strips unknown properties from request bodies

## 📊 Task Model

```typescript
interface Task {
  id: string;           // UUID
  title: string;        // Required, 1-100 chars
  description: string;  // Optional, max 500 chars
  status: TaskStatus;   // OPEN | IN_PROGRESS | DONE
  priority: TaskPriority; // LOW | MEDIUM | HIGH
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Running Tests

```bash
npm test
```
