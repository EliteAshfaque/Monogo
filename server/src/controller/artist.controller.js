const Artist = require("../db/model/artist.model");

exports.listArtists = async (_req, res) => {
  const artists = await Artist.find().sort({ name: 1 });
  res.json({ artists });
};

exports.createArtist = async (req, res) => {
  const { name, bio, image, verified } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Artist name is required" });
  const artist = await Artist.create({ name: name.trim(), bio, image, verified });
  res.status(201).json({ artist });
};
