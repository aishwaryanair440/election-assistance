const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  progress: { type: Number, default: 0 },
  quiz_scores: [{
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number, required: true },
    total: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
