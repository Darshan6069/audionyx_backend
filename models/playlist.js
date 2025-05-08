const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // Reference to Song model
}, { timestamps: true });



module.exports = PlaylistSchema;