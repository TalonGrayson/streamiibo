// Use Express for routing
const express = require("express");
const path = require("path");
const app = express();

if (app.settings.env === "development") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const port = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Particle mumbojumbo
const Particle = require("particle-api-js");
const particle = new Particle();
const token = process.env.PARTICLE_ACCESS_TOKEN;
const devicesPr = particle.listDevices({ auth: token });

// Requiring this is enough to trigger the connection to the db
const db = require("./mongodb");

const scanListener = require("./scan-listener");

devicesPr.then(
  function (devices) {
    const device_names = process.env.PARTICLE_DEVICE_NAME.split(",");

    const found_devices = devices.body.filter((device) =>
      device_names.includes(device.name)
    );

    found_devices.forEach((found_device) => {
      connectionStatus(found_device);

      particle
        .getEventStream({
          name: "incoming_scan",
          deviceId: found_device.id,
          auth: token,
        })
        .then(function (stream) {
          stream.on("event", function (data) {
            scanListener.particleEventListener(data);
          });
        });
    });
  },
  function (err) {
    console.log("List devices call failed: ", err);
  }
);

connectionStatus = (device) => {
  console.log(
    `${device.name} ${device.connected ? "is" : "is not"} connected.`
  );
};

//  Tag model
const Tag = require("./models/Tag");

getAllTags = () => {
  return Tag.find({}, function (err, docs) {
    return docs;
  });
};

getActiveTags = () => {
  return Tag.find({ deleted: false }, function (err, docs) {
    return docs;
  });
};

getDeletedTags = () => {
  return Tag.find({ deleted: true }, function (err, docs) {
    return docs;
  });
};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/public/index.html");
  console.log("index");
});

app.get("/mytags", function (req, res) {
  res.sendFile(__dirname + "/client/public/my_tags.html");
});

app.get("/api/v1/mytags", function (req, res) {
  getActiveTags().then((tags) => res.send(tags));
});

app.get("/api/v1/mytags/delete/:tag_id", async (req, res) => {
  console.log(`Deleting ${req.params.tag_id}...`);

  Tag.findByIdAndUpdate(
    req.params.tag_id,
    { deleted: true },
    { new: true },
    function (err, tag) {
      console.log(`Deleted: ${tag}`);
    }
  ).then((tag) => res.redirect("/"));
});

app.get("/api/v1/tag/:name", function (req, res) {
  Tag.findOne({ name: req.params.name }).then((tag) => res.json(tag));
});

app.get("/*", function (req, res) {
  res.sendFile(__dirname + "/client/public/404.html");
});

app.listen(port, () => {
  console.log(`App is listening on ${port}...`);
});
