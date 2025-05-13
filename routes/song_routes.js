const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song_controller.js');
const upload = require('../middleware/upload');
  

// Route for uploading a song
router.post(
  '/upload',
  upload.fields([
    { name: 'file', maxCount: 1 },       // MP3 file
    { name: 'thumbnail', maxCount: 1 }, // Thumbnail image
    { name: 'subtitles', maxCount: 1 }, // Subtitle file
  ]),
  SongController.uploadSong
);
router.get('/', SongController.getSongs);
router.get('/trending',SongController.getTrendingSongs);


module.exports = router;