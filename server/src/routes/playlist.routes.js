const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controller/playlist.controller");
router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.post("/:id/tracks", auth, controller.addTrack);
module.exports = router;
