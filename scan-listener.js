const Particle = require("particle-api-js");
const particle = new Particle();
const token = process.env.PARTICLE_ACCESS_TOKEN;

// Use Socket.IO for full duplex between server and client
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = (module.exports.io = require("socket.io")(http));

//  Tag model
const Tag = require("./models/Tag");

const PORT = 8123;

findOrCreateTag = (id) => {
  return Tag.findOne({ id: id }).then((tag) => {
    if (!tag) {
      const newTag = new Tag({
        id: id,
        origin: "Unknown origin",
        type: "Unkown type",
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

    particle.publishEvent({
      name: "scan_info",
      data: `${tag.origin},${tag.type},${tag.name},${tag.light_rgb}`,
      isPrivate: true,
      auth: token,
    });

    io.emit("scan_detected", { scannedTag: tag });

    return tag;
  });
};

performTagAction = (scannedTag) => {
  switch (scannedTag.name) {
    case "Mega Man":
      obsCon.obs.send("SetCurrentScene", {
        "scene-name": "Digital Work",
      });
      break;
    case "Boba Fett":
      obsCon.obs.send("SetCurrentScene", {
        "scene-name": "Physical Work",
      });
      break;
    case "Hulk (Terrain)":
      obsCon.obs
        .send("SetSceneItemProperties", {
          "scene-name": "Popups",
          item: "Bonjovi",
          visible: true,
        })
        .then(
          setTimeout(function () {
            obsCon.obs.send("SetSceneItemProperties", {
              "scene-name": "Popups",
              item: "Bonjovi",
              visible: false,
            });
          }, 9000)
        );
      break;
    case "Darth Vader (Force FX)":
      obsCon.obs
        .send("SetSceneItemProperties", {
          "scene-name": "Popups",
          item: "IAmTheHype",
          visible: true,
        })
        .then(
          setTimeout(function () {
            obsCon.obs.send("SetSceneItemProperties", {
              "scene-name": "Popups",
              item: "IAmTheHype",
              visible: false,
            });
          }, 4000)
        );
      break;
    case "Infinity Gauntlet":
      obsCon.obs
        .send("SetSceneItemProperties", {
          "scene-name": "Popups",
          item: "ShotDisclaimer",
          visible: true,
        })
        .then(
          setTimeout(function () {
            obsCon.obs.send("SetSceneItemProperties", {
              "scene-name": "Popups",
              item: "ShotDisclaimer",
              visible: false,
            });
          }, 5000)
        );
      break;
    default:
      console.log(
        `Tag with ID ${scannedTag.id} has no actions associated to it!`
      );
      break;
  }
};

io.on("connection", (socket) => {
  console.log("Server Socket connected...");
  socket.on("disconnect", () => {
    console.log("Socket disconnected...");
  });
});

let io = http.listen(PORT);
io.configure = () -> {
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
}

module.exports.particleEventListener = (incoming_payload) => {
  findOrCreateTag(incoming_payload.data);
};
