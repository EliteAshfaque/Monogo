const jwt = require("jsonwebtoken");
const userModel = require("../db/model/user.model");

async function authMiddleware(request, response, next) {
  try {
    const token = request.cookies.token;

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
}

module.exports = authMiddleware;
