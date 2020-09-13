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

findOrCreateTag = (id) => {
  return Tag.findOne({ id: id }).then((tag) => {
    if (!tag) {
      const newTag = new Tag({
        id: id,
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
    console.log(
      `{"origin": "${tag.origin}", "type": "${tag.type}", "name": "${tag.name}", "light_rgb": "${tag.light_rgb}"}`
    );
    particle.publishEvent({
      name: "scan_info",
      data: `{
          "origin": "${tag.origin}", 
        "type": "${tag.type}", 
        "name": "${tag.name}", 
        "light_rgb": "${tag.light_rgb}"
      }`,
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
  findOrCreateTag(incoming_payload.data);
};
