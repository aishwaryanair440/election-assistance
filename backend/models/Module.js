const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  icon: { type: String, default: 'book-open' }
});

module.exports = mongoose.model('Module', ModuleSchema);
