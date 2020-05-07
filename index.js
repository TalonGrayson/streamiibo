// Use .env file for local environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const Particle = require("particle-api-js");
const particle = new Particle();
const token = process.env.PARTICLE_ACCESS_TOKEN;
const devicesPr = particle.listDevices({ auth: token });

const db = require("./mongodb");

const scanListener = require("./scan-listener");

devicesPr.then(
  function (devices) {
    const device = devices.body.filter(
      (device) => device.name === process.env.PARTICLE_DEVICE_NAME
    )[0];
    connectionStatus(device);
    particle
      .getEventStream({ name: "scanned_id", deviceId: device.id, auth: token })
      .then(function (stream) {
        stream.on("event", function (data) {
          scanListener.particleEventListener(data);
        });
      });
  },
  function (err) {
    console.log("List devices call failed: ", err);
  }
);

connectionStatus = (device) => {
  console.log(
    `${process.env.PARTICLE_DEVICE_NAME} ${
      device.connected ? "is" : "is not"
    } connected.`
  );
};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/*", function (req, res) {
  res.sendFile(__dirname + "/public/404.html");
});

app.listen(port, () => {
  console.log(`App is listening on ${port}...`);
});
