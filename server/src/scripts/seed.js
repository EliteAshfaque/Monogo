require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const connectDB = require("../db/db");
const Artist = require("../db/model/artist.model");
const Music = require("../db/model/music.model");
const User = require("../db/model/user.model");
const bcrypt = require("bcryptjs");

const covers = ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80", "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=500&q=80", "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=500&q=80"];
const artists = ["Neon Avenue", "Maya Sol", "The Midnight Echo", "Kairo Bloom", "Luna Parks"];
const titles = ["Afterglow", "City Lights", "Golden Hour", "Slow Motion", "Velvet Sky", "Runaway", "Satellite", "Paper Planes", "Electric Blue", "Home Again"];
const genres = ["Pop", "Electronic", "Lo-fi", "Indie", "R&B", "Hip-Hop", "House", "Acoustic", "Ambient", "Rock"];

(async () => {
  await connectDB();
  const hash = await bcrypt.hash("Admin123!", 10);
  await User.findOneAndUpdate({ email: "admin@sonora.local" }, { username: "sonora_admin", email: "admin@sonora.local", password: hash, role: "admin", plan: "premium" }, { upsert: true, new: true });
  const savedArtists = [];
  for (const [index, name] of artists.entries()) savedArtists.push(await Artist.findOneAndUpdate({ name }, { name, bio: `Independent artist ${name}`, image: covers[index % covers.length], verified: true }, { upsert: true, new: true }));
  for (const [index, title] of titles.entries()) await Music.findOneAndUpdate({ title }, { title, artist: savedArtists[index % savedArtists.length]._id, coverImage: covers[index % covers.length], uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: 180 + index * 7, isPremium: index % 3 === 0, genre: genres[index], plays: 1000 + index * 731 }, { upsert: true, new: true });
  console.log("Seed complete. Admin: admin@sonora.local / Admin123!");
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
