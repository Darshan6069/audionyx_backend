const admin = require('firebase-admin');
const serviceAccount = require('../config/audionyx-e0849-firebase-adminsdk-fbsvc-183ff4b4b6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;