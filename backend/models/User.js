import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['CFG', 'USR'], default: 'USR' },
});

const User = mongoose.model('User', userSchema);

export default User;
