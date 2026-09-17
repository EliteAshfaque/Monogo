const express = require("express");
const router = express.Router();
const postModel = require("../db/model/post.model");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create-post", authMiddleware, async (request, response) => {
  try {
    const { title, description, image } = request.body;

    const post = await postModel.create({
      title,
      description,
      image,
      user: request.user._id,
    });

    response.status(201).json({
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
