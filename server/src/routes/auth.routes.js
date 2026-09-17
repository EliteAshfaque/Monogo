const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authcontroller.registerUser);
router.post("/login", authcontroller.loginUser);
router.get("/me", authMiddleware, authcontroller.me);
router.post("/logout", authcontroller.logout);
router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/reset-password/:token", authcontroller.resetPassword);
router.put("/profile", authMiddleware, authcontroller.updateProfile);

module.exports = router;
