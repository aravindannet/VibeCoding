import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import tasksRouter from './routes/tasks.js';
import usersRouter from './routes/users.js';

dotenv.config();

// Force Node.js to use Google DNS for SRV record resolution (required for MongoDB Atlas with Node.js v24+)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected successfully`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
