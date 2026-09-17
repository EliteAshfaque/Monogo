const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  bio: { type: String, default: "" },
  image: { type: String, default: "" },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("artist", artistSchema);
