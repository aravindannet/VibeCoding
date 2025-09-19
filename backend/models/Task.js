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
  ,
  // Comments left by users on the task
  comments: [{
    author: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  // History entries capturing notable changes (status, owner, priority etc.)
  // Note: avoid using the key name `type` because Mongoose treats it specially in schema definitions.
  history: [{
    action: { type: String }, // e.g., 'status', 'owner', 'priority', 'created', 'deleted', 'comment'
    by: String,
    from: String,
    to: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
