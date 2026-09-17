const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "artist",
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    duration: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    genre: { type: String, default: "Pop", index: true },
    plays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MusicModel = mongoose.model("music", musicSchema);

module.exports = MusicModel;
