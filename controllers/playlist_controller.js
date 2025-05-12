// controllers/playlist_controller.js
const User = require('../models/user_schema');
const Song  = require('../models/song'); // Import the Song model



exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, thumbnailUrl, songs } = req.body;
    const userId = req.user?.userId; // Retrieve userId from req.user

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Playlist description is required' });
    }

    // Find the user and add the playlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPlaylist = {
      name,
      description,
      thumbnailUrl: thumbnailUrl || '',
      songs: songs || [],
    };

    user.playlists.push(newPlaylist); // Add the playlist to the user's playlists array
    await user.save();

    res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({
      message: 'Error creating playlist',
      error: err.message || 'Unknown error',
    });
  }
};


exports.getPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the user by ID and return their playlists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.playlists); // Return the playlists array
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({
      message: 'Error fetching playlists',
      error: err.message || 'Unknown error',
    });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body; // Get playlist ID and song ID from the request body
    const userId = req.user.userId; // Get user ID from the authenticated user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the playlist in the user's playlists array
    const playlist = user.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Fetch the full song data from the Song model
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Add the full song data to the playlist's songs array
    playlist.songs.push(song.toObject()); // Convert Mongoose document to plain object
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Song added to playlist successfully', playlist });
  } catch (err) {
    console.error('Error adding song to playlist:', err);
    res.status(500).json({
      message: 'Error adding song to playlist',
      error: err.message || 'Unknown error',
    });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const userId = req.user.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the playlist in the user's playlists array
    const playlist = user.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }

    // Remove the song from the playlist's songs array
    playlist.songs = playlist.songs.filter((song) => song._id.toString() !== songId);

    // Save the parent document (user)
    await user.save();

    res.status(200).json({ message: 'Song removed from playlist successfully', playlist });
  } catch (err) {
    console.error('Error removing song from playlist:', err);
    res.status(500).json({
      message: 'Error removing song from playlist',
      error: err.message || 'Unknown error',
    });
  }
};

exports.getSongsFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params; // Get playlist ID from request parameters
    const userId = req.user.userId; // Get user ID from the authenticated user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the playlist in the user's playlists array
    const playlist = user.playlists.id(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Populate the songs array with full song details
    const populatedSongs = await Song.find({ _id: { $in: playlist.songs } });

    res.status(200).json({ songs: populatedSongs });
  } catch (err) {
    console.error('Error fetching songs from playlist:', err);
    res.status(500).json({
      message: 'Error fetching songs from playlist',
      error: err.message || 'Unknown error',
    });
  }
};

exports.deletePlaylist = async (req, res) => {
  const { userId, playlistId } = req.params;

  try {
    // Find the user and remove the playlist from the "playlists" array
    const result = await User.updateOne(
      { _id: userId }, // Find the user by ID
      { $pull: { playlists: { _id: playlistId } } } // Remove the playlist by ID
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Playlist not found or already deleted' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Failed to delete playlist', error });
  }
};