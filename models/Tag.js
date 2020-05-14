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
    type: Number,
    required: true,
  },
  defense: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  attack: {
    type: Number,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  light_rgb: {
    type: String,
    required: true,
  },
});

module.exports = Tag = mongoose.model("tag", TagSchema);
