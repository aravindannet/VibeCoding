import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  startDate: String,
  endDate: String,
  jiraKey: String,
  jiraBaseUrl: String,
  reaction: String,
  status: { type: String, enum: ['todo', 'inprogress', 'blocker', 'done'], default: 'todo' }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
