const Playlist = require("../db/model/playlist.model");

exports.list = async (req, res) => res.json({ playlists: await Playlist.find({ user: req.user._id }).populate("tracks", "title coverImage artist").sort({ updatedAt: -1 }) });
exports.create = async (req, res) => {
  if (!req.body.name?.trim()) return res.status(400).json({ message: "Playlist name is required" });
  res.status(201).json({ playlist: await Playlist.create({ name: req.body.name.trim(), user: req.user._id }) });
};
exports.addTrack = async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  if (!playlist.tracks.some(id => id.toString() === req.body.trackId)) playlist.tracks.push(req.body.trackId);
  await playlist.save();
  res.json({ playlist, message: "Track added to playlist" });
};
