const express = require('express');
const router = express.Router();
const authcontroller = require('../controller/auth.controller');
router.post('/register', authcontroller.registerUser);
module.exports = router; 