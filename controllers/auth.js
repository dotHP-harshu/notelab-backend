const jwt = require("jsonwebtoken");
const { sendError, sendSuccess } = require("../utils/response");
const userModel = require("../models/user.model");

module.exports.googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  req.userId = undefined;
  sendSuccess(res, 200, true, "Logout successfull", undefined);
};

module.exports.getUser = async (req, res) => {
  const id = req.userId;
  try {
    const user = await userModel.findById(id);
    if (!user)
      return sendError(res, 404, false, "An error occurs while getting user.", {
        message: "User not found",
        code: 404,
      });

    sendSuccess(res, 200, true, "Successfully get user", { user });
  } catch (error) {
    sendError(res, 400, false, "An error occurs while getting user.", {
      error,
    });
  }
};
