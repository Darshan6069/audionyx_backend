const mongoose = require("mongoose");

async function mongoDbConnection(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("mongodb connected to audionyx_backend"))
    .catch((err) => console.log("mongo error at audionyx_backend", err));
}

module.exports = { mongoDbConnection };

