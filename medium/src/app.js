const express = require("express");
const cors = require("cors");
const postModel = require("./db/model/post.model");
const uploadFile = require("./services/storage.service");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// CREATE
app.post("/create-post", upload.single("image"), async (request, res) => {
  try {
    if (!request.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await uploadFile(request.file.buffer);
    const post = await postModel.create({
      caption: request.body.caption,
      image: result.url,
    });

    res.status(201).json({
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
});

// GET ALL
app.get("/posts", async (req, res) => {
  try {
    const posts = await postModel.find().sort({ _id: -1 });
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
});

// GET ONE
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
});

// UPDATE
app.put("/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {};

    if (req.body.caption !== undefined) {
      updateData.caption = req.body.caption;
    }

    if (req.file) {
      const result = await uploadFile(req.file.buffer);
      updateData.image = result.url;
    }

    const post = await postModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      message: "Post Updated Successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
});

// DELETE
app.delete("/posts/:id", async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({
      message: "Post Deleted Successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
});

module.exports = app;
