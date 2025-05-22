const admin = require('firebase-admin');
const serviceAccount = require('../config/audionyx-e0849-firebase-adminsdk-fbsvc-7acf6950a5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;