const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const controller = require("../controller/artist.controller");
router.get("/", controller.listArtists);
router.post("/", auth, admin, controller.createArtist);
module.exports = router;
