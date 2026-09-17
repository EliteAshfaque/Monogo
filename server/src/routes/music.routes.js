const express = require("express");
const multer = require("multer");
const router = express.Router();
const musicController = require("../controller/music.controller");
const authMiddleware = require("../middleware/auth.middleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.get("/", musicController.listMusic);
router.get("/genres", musicController.listGenres);
router.get("/:id/play", (req, _res, next) => { if (!req.cookies.token) return next(); return authMiddleware(req, _res, next); }, musicController.playMusic);

router.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  musicController.createMusic
);

module.exports = router;
