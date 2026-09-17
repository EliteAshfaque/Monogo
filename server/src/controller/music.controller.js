const MusicModel = require("../db/model/music.model");
const Artist = require("../db/model/artist.model");
const uploadFile = require("../services/storage.service");

async function createMusic(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to create music",
      });
    }

    const { title, artist, duration, isPremium, genre } = req.body;
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.cover?.[0];

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!artist) return res.status(400).json({ message: "Artist is required" });
    if (!await Artist.exists({ _id: artist })) return res.status(400).json({ message: "Choose a valid artist" });
    if (!audioFile) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const audioUpload = await uploadFile(
      audioFile.buffer,
      audioFile.originalname || "audio.mp3"
    );

    let coverImage;
    if (coverFile) {
      const coverUpload = await uploadFile(
        coverFile.buffer,
        coverFile.originalname || "cover.jpg"
      );
      coverImage = coverUpload.url;
    }

    const music = await MusicModel.create({
      title,
      artist,
      uri: audioUpload.url,
      coverImage,
      duration: Number(duration) || 0,
      isPremium: isPremium === "true" || isPremium === true,
      genre: genre?.trim() || "Pop",
    });

    return res.status(201).json({
      message: "Music created successfully",
      music,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function listMusic(req, res) {
  const search = req.query.q?.trim();
  const filters = [];
  if (search) {
    const artists = await Artist.find({ name: { $regex: search, $options: "i" } }).select("_id");
    filters.push({ $or: [{ title: { $regex: search, $options: "i" } }, { artist: { $in: artists.map(artist => artist._id) } }] });
  }
  if (req.query.genre && req.query.genre !== "All") filters.push({ genre: req.query.genre });
  const query = filters.length ? { $and: filters } : {};
  const tracks = await MusicModel.find(query).populate("artist", "name image verified").sort({ createdAt: -1 });
  res.json({ tracks });
}

async function listGenres(_req, res) {
  const genres = await MusicModel.distinct("genre");
  res.json({ genres: ["All", ...genres.filter(Boolean).sort()] });
}

async function playMusic(req, res) {
  const track = await MusicModel.findById(req.params.id).populate("artist", "name image");
  if (!track) return res.status(404).json({ message: "Track not found" });
  if (track.isPremium && req.user?.plan !== "premium") return res.status(402).json({ message: "This track is available with Premium", code: "PREMIUM_REQUIRED" });
  track.plays += 1;
  await track.save();
  res.json({ track });
}

module.exports = {
  createMusic,
  listMusic,
  listGenres,
  playMusic,
};
