import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:uid - get user by UID
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:uid/role - update user role
router.put('/:uid/role', async (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;
  if (!['CFG', 'USR'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// POST /api/users - create or update user (upsert)
router.post('/', async (req, res) => {
  const { uid, displayName, email, role } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ error: 'uid and email required' });
  }
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { displayName, email, role: role || 'USR' },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upsert user' });
  }
});

export default router;
