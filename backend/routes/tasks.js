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
    // Load existing task to compute history entries
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const updates = req.body;
    const historyEntries = [];
    if (updates.status && updates.status !== existing.status) {
      historyEntries.push({ action: 'status', by: updates._updatedBy || 'system', from: existing.status, to: updates.status });
    }
    if (updates.owner && updates.owner !== existing.owner) {
      historyEntries.push({ action: 'owner', by: updates._updatedBy || 'system', from: existing.owner || '', to: updates.owner });
    }
    if (updates.priority && updates.priority !== existing.priority) {
      historyEntries.push({ action: 'priority', by: updates._updatedBy || 'system', from: existing.priority || '', to: updates.priority });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { ...updates, $push: { history: { $each: historyEntries } } }, { new: true, runValidators: true });
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

// Add a comment to a task
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text required' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const comment = { author: author || 'Anonymous', text, createdAt: new Date() };
      // Do not keep a separate comments array; record comments as history entries only
      const historyEntry = { action: 'comment', by: author || 'Anonymous', from: '', to: text, createdAt: new Date() };
      task.history.push(historyEntry);
      await task.save();
      // Return the new history entry so the client can update local state
      res.status(201).json(historyEntry);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: err.message });
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
