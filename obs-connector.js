// Use .env file for local environment variables
const dotenv = require("dotenv");
dotenv.config();

const OBSWebSocket = require("obs-websocket-js");
const obs = new OBSWebSocket();

obs
  .connect({
    address: "localhost:4444",
    password: process.env.OBS_WEBSOCKET_PASSWORD,
  })
  .then(() => {
    console.log(`Streamiibo is connected to OBS... have a great stream!`);
  })
  .catch((err) => {
    // Promise convention dicates you have a catch on every chain.
    console.log(err);
  });

// You must add this handler to avoid uncaught exceptions.
obs.on("error", (err) => {
  console.error("socket error:", err);
});

module.exports.obs = obs;
