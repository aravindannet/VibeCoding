Local Docker & docker-compose

This directory contains the local containerization setup for the project.

Quick start (requires Docker and docker-compose):

1. Start the stack (frontend, backend, MongoDB):

   docker-compose up --build

2. App URLs:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

Notes:
- The backend is configured to connect to the local `mongo` service using the `MONGO_URI` set in `docker-compose.yml`.
- In this local setup, the backend source is mounted as a volume; changes to `backend/` files will be reflected without rebuilding the image.
- For production/image builds, we use multi-stage builds and will not mount volumes; see Dockerfile.frontend and backend/Dockerfile.

Next steps:
- Create ECR repos for frontend/backend and push images built from the Dockerfiles.
- Scaffold Kubernetes manifests or ECS Task Definitions depending on your target.
