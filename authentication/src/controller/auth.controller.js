const userModel = require("../db/model/user.model");
const jwt = require("jsonwebtoken");

async function registerUser(request, response) {
  try {
    const { username, email, password } = request.body;

    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return response.status(409).json({
        message: "User Already Exists",
      }); 
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    response.cookie("token", token);

    response.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  registerUser,
};
