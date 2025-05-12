const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require("os"); // Import the os module
const { mongoDbConnection } = require("./views/mongodb_connection");
const app = express();
const port = process.env.PORT || 4000;
const songRoutes = require('./routes/song_routes');
const playlistRoutes = require('./routes/playlist_routes');
const authRoutes = require("./routes/auth_routes");

// Get the local IP address dynamically
const networkInterfaces = os.networkInterfaces();
const ipAddress = Object.values(networkInterfaces)
  .flat()
  .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoDbConnection("mongodb://localhost:27017/audionyx_backend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/uploads', express.static('uploads')); // Serve static files

// Routes
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use("/api/auth", authRoutes);

// Start the server with the dynamically fetched IP address
app.listen(port, ipAddress, () =>
  console.log(`Server started at http://${ipAddress}:${port}`)
);