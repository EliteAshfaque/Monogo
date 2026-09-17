const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controller/library.controller");
router.get("/", auth, controller.getLibrary);
router.post("/liked/:trackId", auth, controller.toggleLike);
module.exports = router;
