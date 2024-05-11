const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NodeSchema = new Schema({
  id: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  position: { type: Schema.Types.Mixed },
  width: { type: Number },
  height: { type: Number },
  positionAbsolute: { type: Schema.Types.Mixed },
  selected: { type: Boolean },
  dragging: { type: Boolean },
});

const EdgeSchema = new Schema({
  source: { type: String, required: true },
  sourceHandle: { type: String },
  target: { type: String, required: true },
  targetHandle: { type: String },
  id: { type: String, required: true },
});

const emailSequenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nodes: [{ type: Object }], // Define your node schema here
  edges: [{ type: Object }], // Define your edge schema here
  // Add any other fields you need for the email sequence schema
});

module.exports = mongoose.model("EmailSequence", emailSequenceSchema);
