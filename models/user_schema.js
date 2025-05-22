const mongoose = require('mongoose');
const PlaylistSchema = require('./playlist').schema; // Import the Playlist schema

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
 password: { type: String }, 
  google_id: { type: String, unique: true }, 
  playlists: [
    new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      thumbnailUrl: { type: String, default: '' },
      songs: { type: Array, default: [] }, // Ensure `songs` is an array with a default value
    }),
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);