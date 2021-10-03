const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
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
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  commentCount: {
    type: Number,
    required: false,
    default: 0,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likeCount: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model('Article', ArticleSchema);
