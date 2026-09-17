const Library = require("../db/model/library.model");

exports.getLibrary = async (req, res) => {
  const library = await Library.findOneAndUpdate(
    { user: req.user._id }, { $setOnInsert: { user: req.user._id, likedTracks: [] } }, { upsert: true, new: true }
  ).populate({ path: "likedTracks", populate: { path: "artist", select: "name image verified" } });
  res.json({ likedTracks: library.likedTracks });
};

exports.toggleLike = async (req, res) => {
  const library = await Library.findOneAndUpdate(
    { user: req.user._id }, { $setOnInsert: { user: req.user._id, likedTracks: [] } }, { upsert: true, new: true }
  );
  const trackId = req.params.trackId;
  const exists = library.likedTracks.some(id => id.toString() === trackId);
  library.likedTracks = exists ? library.likedTracks.filter(id => id.toString() !== trackId) : [...library.likedTracks, trackId];
  await library.save();
  res.json({ liked: !exists, likedTrackIds: library.likedTracks.map(id => id.toString()) });
};
