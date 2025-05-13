const os = require('os');
const Song = require('../models/song.js');
const admin = require('../middleware/firebase.js');

class SongController {
  static async uploadSong(req, res) {
    const { title, artist, album, genre } = req.body;
    const mp3File = req.files['file']?.[0];
    const thumbnailFile = req.files['thumbnail']?.[0];
    const subtitleFile = req.files['subtitles']?.[0]; // ✅ Subtitle support

    const networkInterfaces = os.networkInterfaces();
    const ipAddress = Object.values(networkInterfaces)
      .flat()
      .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

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
        mp3Url: `http://${ipAddress}:4000/uploads/songs/${mp3File.filename}`,
        thumbnailUrl: thumbnailFile
          ? `http://${ipAddress}:4000/uploads/thumbnails/${thumbnailFile.filename}`
          : '',
        subtitleUrl: subtitleFile
          ? `http://${ipAddress}:4000/uploads/subtitles/${subtitleFile.filename}`
          : '', // ✅ Store subtitle URL
      };

      const song = await Song.create(songData);

      // Send push notification
      const message = {
        notification: {
          title: 'New Song Uploaded!',
          body: `${title} by ${artist} is now available.`,
        },
        topic: 'new_songs',
        android: {
          priority: 'high',
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
        },
      };

      try {
        const response = await admin.messaging().send(message);
        console.log('✅ Notification sent:', response);
      } catch (error) {
        console.error('❌ Failed to send FCM notification:', error);
      }

      res.status(201).json({ message: 'Song uploaded successfully', song });
    } catch (error) {
      console.error('Error uploading song:', error);
      res.status(500).json({ error: 'Failed to upload song' });
    }
  }

  static async getSongs(req, res) {
    try {
      const networkInterfaces = os.networkInterfaces();
      const ipAddress = Object.values(networkInterfaces)
        .flat()
        .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

      const songs = await Song.find();

      const updatedSongs = songs.map((song) => ({
        ...song._doc,
        mp3Url: song.mp3Url.replace(/http:\/\/.*?:4000/, `http://${ipAddress}:4000`),
        thumbnailUrl: song.thumbnailUrl.replace(/http:\/\/.*?:4000/, `http://${ipAddress}:4000`),
        subtitleUrl: song.subtitleUrl?.replace(/http:\/\/.*?:4000/, `http://${ipAddress}:4000`) || '', // ✅ Update URL
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
