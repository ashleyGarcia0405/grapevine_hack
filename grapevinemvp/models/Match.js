import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);