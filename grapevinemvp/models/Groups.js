import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);