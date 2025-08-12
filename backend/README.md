# Kanban Backend

Node.js Express backend for Kanban app with MongoDB Atlas integration.

## Setup
1. Copy `.env.example` to `.env` and add your MongoDB Atlas connection string.
2. Run `npm install` to install dependencies.
3. Start the server with `npm run dev` (for development) or `npm start` (for production).

## API Endpoints
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
