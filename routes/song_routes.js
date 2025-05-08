const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song_controller.js');
const upload = require('../middleware/upload');
  

// Route for uploading a song
router.post(
  '/upload',
  upload.fields([{ name: 'file' }, { name: 'thumbnail' }]),
  SongController.uploadSong   
);
router.get('/', SongController.getSongs);
router.get('/trending',SongController.getTrendingSongs);


module.exports = router;