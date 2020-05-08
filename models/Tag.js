const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Create Schema
const TagSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  lastScanTime: {
    type: String,
    required: true,
  },
  health: {
    type: integer,
    required: true,
  },
  defense: {
    type: integer,
    required: true,
  },
  speed: {
    type: integer,
    required: true,
  },
  attack: {
    type: integer,
    required: true,
  },
});

module.exports = Tag = mongoose.model("tag", TagSchema);
