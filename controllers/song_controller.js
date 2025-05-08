const os = require('os'); // Import the os module
const Song = require('../models/song.js');

class SongController {
  static async uploadSong(req, res) {
    const { title, artist, album, genre } = req.body;
    const mp3File = req.files['file']?.[0];
    const thumbnailFile = req.files['thumbnail']?.[0];

    // Get the local IP address dynamically
    const networkInterfaces = os.networkInterfaces();
    const ipAddress = Object.values(networkInterfaces)
      .flat()
      .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

    // Validate required fields
    if (!title || !artist || !album || !mp3File) {
      return res
        .status(400)
        .json({ error: 'Title, artist, album, and MP3 file are required' });
    }

    try {
      const songData = {
        title,
        artist,
        album,
        genre: genre || 'Unknown',
        mp3Url: `http://${ipAddress}:4000/uploads/songs/${mp3File.filename}`, // Use dynamic IP
        thumbnailUrl: thumbnailFile
          ? `http://${ipAddress}:4000/uploads/thumbnails/${thumbnailFile.filename}` // Use dynamic IP
          : '',
      };

      const song = await Song.create(songData);
      res.status(201).json({ message: 'Song uploaded successfully', song });
    } catch (error) {
      console.error('Error uploading song:', error);
      res.status(500).json({ error: 'Failed to upload song' });
    }
  }

  static async getSongs(req, res) {
    try {
      // Get the local IP address dynamically
      const networkInterfaces = os.networkInterfaces();
      const ipAddress = Object.values(networkInterfaces)
        .flat()
        .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

      const songs = await Song.find(); // Fetch all songs

      // Update the song URLs with the current IP address
      const updatedSongs = songs.map((song) => ({
        ...song._doc,
        mp3Url: song.mp3Url.replace(/http:\/\/.*?:4000/, `http://${ipAddress}:4000`),
        thumbnailUrl: song.thumbnailUrl.replace(/http:\/\/.*?:4000/, `http://${ipAddress}:4000`),
      }));

      res.status(200).json(updatedSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
      res.status(500).json({ error: 'Failed to fetch songs' });
    }
  }

  static async getTrendingSongs(req, res) {
    try {
      const songs = await Song.find().sort({ createdAt: -1 }).limit(10);
      res.status(200).json(songs);
    } catch (error) {
      console.error('Error fetching trending songs:', error);
      res.status(500).json({ error: 'Failed to fetch trending songs' });
    }
  }


}

module.exports = SongController;