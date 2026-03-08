# Deployment Guide

## Current Setup
- **Frontend**: Deployed to Netlify (static React/Vite build)
- **Backend**: Node.js/Express API (needs separate hosting)
- **Database**: MongoDB (Docker locally, Atlas recommended for production)

## Deploying to Netlify

### 1. Backend Deployment (Required First!)
Your backend must be deployed separately before the frontend will work. Options:

**Option A: Render (Recommended)**
1. Push your backend code to GitHub
2. Go to https://render.com and create a new Web Service
3. Connect your GitHub repo, select `backend` folder as root
4. Set environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: 3001 (or any port)
5. Deploy and note the URL (e.g., `https://your-backend.onrender.com`)

**Option B: Railway / Heroku / AWS**
Similar process - deploy Node.js backend, set env vars, get the URL.

### 2. MongoDB Production Database
1. Create free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Whitelist IP: `0.0.0.0/0` (or specific IPs)
3. Create database user
4. Get connection string and add to backend `MONGODB_URI`

### 3. Frontend Deployment (Netlify)
1. In Netlify dashboard, go to: **Site settings > Environment variables**
2. Add this variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Commit and push your code to GitHub
4. Netlify will auto-deploy (or trigger manual deploy)
5. Your frontend will now connect to the production backend

### 4. Verify Deployment
Test your production backend:
```bash
curl https://your-backend.onrender.com/api/tasks
```

Then open your Netlify URL and check browser console for errors.

## Local Development
```bash
# Terminal 1: Start MongoDB (Docker)
docker run -d --name kanban-mongo -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  mongo:6

# Terminal 2: Start backend
cd backend
npm install
npm run dev

# Terminal 3: Start frontend
cd ..
npm install
npm run dev
```

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb://root:example@host.docker.internal:27017/kanban?authSource=admin
PORT=5001
```

### Frontend (Netlify Environment Variables)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting
- **CORS errors**: Ensure backend has `app.use(cors())` configured
- **404 errors**: Verify `VITE_API_URL` points to correct backend URL
- **Connection refused**: Backend might not be running or URL is wrong
- **MongoDB errors**: Check connection string and IP whitelist in Atlas
