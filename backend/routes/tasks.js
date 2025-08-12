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
  console.log('POST /tasks - body:', req.body);
  const task = new Task(req.body);
  await task.save();
  console.log('Created task:', task);
  res.status(201).json(task);
});

// Update a task
router.put('/:id', async (req, res) => {
  console.log('PUT /tasks/:id - id:', req.params.id, 'body:', req.body);
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Updated task:', task);
    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  console.log('DELETE /tasks/:id - id:', req.params.id);
  const result = await Task.findByIdAndDelete(req.params.id);
  console.log('Delete result:', result);
  res.status(204).end();
});

export default router;
