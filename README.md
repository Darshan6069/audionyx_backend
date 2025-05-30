# Audionyx Backend

Audionyx Backend is a Node.js-based backend application for managing songs, playlists, and user authentication. It dynamically handles device IP addresses for API calls and serves static files for uploaded content.

## Features
- Upload songs with dynamic IP-based URLs.
- Fetch all songs and trending songs.
- Like and unlike songs.
- User authentication and playlist management.
- MongoDB integration for data storage.

## Project Dependencies
The following dependencies are used in this project:

### Backend
- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building APIs.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Body-Parser**: Middleware for parsing request bodies.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **OS**: Built-in Node.js module for fetching device IP addresses.
- **Multer**: Middleware for handling file uploads.

### Database
- **MongoDB**: NoSQL database for storing songs, playlists, and user data.

## Installation and Setup
Follow these steps to set up the project:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/audionyx_backend.git
   cd audionyx_backend
