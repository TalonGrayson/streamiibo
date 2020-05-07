const obsCon = require("./obs-connector");
const Particle = require("particle-api-js");
const particle = new Particle();
const token = process.env.PARTICLE_ACCESS_TOKEN;

//  Tag model
const Tag = require("./models/Tag");

findOrCreateTag = (id) => {
  return Tag.findOne({ id: id }).then((tag) => {
    if (!tag) {
      const newTag = new Tag({
        id: id,
        origin: "Unknown origin",
        type: "Unkown type",
        name: "Unknown name",
      });
      newTag.save();
      tag = newTag;
    }

    particle.publishEvent({
      name: "scan_info",
      data: `${tag.origin},${tag.type},${tag.name}`,
      isPrivate: true,
      auth: token,
    });

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
    default:
      console.log(
        `Tag with ID ${scannedTag.id} has no actions associated to it!`
      );
      break;
  }
};

module.exports.particleEventListener = (incoming_payload) => {
  findOrCreateTag(incoming_payload.data).then((scannedTag) => {
    performTagAction(scannedTag);
  });
};
