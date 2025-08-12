import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

// Update a task
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete a task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
