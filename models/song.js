const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  mp3Url: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, default: '' },
  genre: { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  subtitleUrl: { type: String, default: '' }, // ✅ New: URL to .srt file
});

// Map _id to id in JSON output
songSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
