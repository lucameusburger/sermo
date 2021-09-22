const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
