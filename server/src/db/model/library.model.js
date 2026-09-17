const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
  likedTracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "music" }],
}, { timestamps: true });

module.exports = mongoose.model("library", librarySchema);
