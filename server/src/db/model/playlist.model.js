const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "music" }],
}, { timestamps: true });

module.exports = mongoose.model("playlist", playlistSchema);
