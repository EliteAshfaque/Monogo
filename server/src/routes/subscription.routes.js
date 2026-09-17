const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controller/subscription.controller");
router.get("/plans", controller.plans);
router.post("/subscribe", auth, controller.subscribe);
router.post("/checkout", auth, controller.createCheckoutSession);
module.exports = router;
