const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the post
  status: { type: String, default: 'scheduled' },  // Initial status is scheduled
  retries: { type: Number, default: 0 },  // Count of how many times the post has failed to publish
  publishedTime: { type: Date },  // When the post was actually published
});


module.exports = mongoose.model('Post', PostSchema);
