const Particle = require("particle-api-js");
const particle = new Particle();
const token = process.env.PARTICLE_ACCESS_TOKEN;

// Use Socket.IO for full duplex between server and client
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//  Tag model
const Tag = require("./models/Tag");

findOrCreateTag = (payload) => {
  console.log(`ID: ${payload.id}`);
  return Tag.findOne({ id: payload.id }).then((tag) => {
    if (!tag) {
      const newTag = new Tag({
        id: payload.id,
        origin: "Unknown origin",
        type: "Unknown type",
        name: "Unknown name",
        lastScanTime: Date(Date.now()),
        health: Math.floor(Math.random() * 10) + 1,
        defense: Math.floor(Math.random() * 10) + 1,
        speed: Math.floor(Math.random() * 10) + 1,
        attack: Math.floor(Math.random() * 10) + 1,
        light_rgb: `${Math.floor(Math.random() * 255) + 1},${
          Math.floor(Math.random() * 255) + 1
        },${Math.floor(Math.random() * 255) + 1}`,
      });
      newTag.save();
      tag = newTag;
    }

    tag.lastScanTime = Date(Date.now());
    tag.deleted = false;
    tag.save();

    const data =
      '{ "device": "' +
      payload.device +
      '","origin": "' +
      tag.origin +
      '","type": "' +
      tag.type +
      '","name": "' +
      tag.name +
      '","light_r": ' +
      tag.light_rgb.split(",")[0] +
      ',"light_g": ' +
      tag.light_rgb.split(",")[1] +
      ',"light_b": ' +
      tag.light_rgb.split(",")[2] +
      "}";

    console.log(`Data: ${data}`);

    particle.publishEvent({
      name: "scan_info",
      data: data,
      isPrivate: true,
      auth: token,
    });

    io.emit("scan_detected", { scannedTag: tag });

    return tag;
  });
};

io.on("connection", (socket) => {
  console.log("Socket connected...");
  socket.on("disconnect", () => {
    console.log("Socket disconnected...");
  });
});

io.listen(8000);

module.exports.particleEventListener = (incoming_payload) => {
  const payload = JSON.parse(incoming_payload.data.replace(/'/g, '"'));
  findOrCreateTag(payload);
};
