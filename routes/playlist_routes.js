const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlist_controller');
const { verifyToken } = require('../middleware/middlewares');

// Apply verifyToken middleware to all playlist routes
router.post('/create', verifyToken, PlaylistController.createPlaylist);
router.get('/', verifyToken, PlaylistController.getPlaylists);
router.post('/add-song', verifyToken, PlaylistController.addSongToPlaylist);
router.post('/remove-song', verifyToken, PlaylistController.removeSongFromPlaylist);
router.delete('/users/:userId/playlists/:playlistId', verifyToken, PlaylistController.deletePlaylist);
router.get('/:playlistId', verifyToken, PlaylistController.getSongsFromPlaylist);

    

module.exports = router;