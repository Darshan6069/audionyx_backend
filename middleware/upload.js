const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure required directories exist
const ensureDirectories = () => {
  const directories = [
    path.join(__dirname, '../uploads/songs'),
    path.join(__dirname, '../uploads/thumbnails'),
    path.join(__dirname, '../uploads/subtitles'),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Call the function to ensure directories exist
ensureDirectories();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Uploading file:', file.fieldname);
    if (file.fieldname === 'file') {
      cb(null, 'uploads/songs/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    } else if (file.fieldname === 'subtitles') {
      cb(null, 'uploads/subtitles/');
    } else {
      console.error('Unexpected field:', file.fieldname);
      cb(new Error('Unexpected field'), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log(`Saving file as: ${uniqueName}`);
    cb(null, uniqueName);
  },
});

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'image/jpeg', 'image/png', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Invalid file type:', file.mimetype);
      cb(new Error('Invalid file type'), false);
    }
  },
});

// Export the upload middleware
module.exports = upload;