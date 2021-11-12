const User = require("../models/User");
const handleAsync = require("../middlewares/handleAsync");
const ErrorResponse = require("../utils/errorResponse");
const { validateLoginInput } = require("../utils/validator");
const { deleteFiles, checkFileExists } = require("../utils/functions");

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();
  res.status(statusCode).json({
    success: true,
    access_token: token,
  });
};

exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { isValid, error } = validateLoginInput(email, password);

  if (!isValid) {
    return next(new ErrorResponse(error, 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Email not found", 401));
  }

  const isMatchPassword = await user.matchPassword(password);

  if (!isMatchPassword) {
    return next(new ErrorResponse("Password is not correct", 401));
  }

  sendTokenResponse(user, 201, res);
});

exports.register = handleAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});

exports.getInfo = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateInfo = handleAsync(async (req, res, next) => {
  const avatar = req.files.avatar ? req.files.avatar[0] : null;
  const cover_photo = req.files.cover_photo ? req.files.cover_photo[0] : null;

  const user = await User.findById(req.user._id);

  if (avatar) {
    // deleteFiles('uploads/user/avatar', post.photos);
    req.body.avatar = avatar.filename;
  }

  if (cover_photo) {
    req.body.cover_photo = cover_photo.filename;
  }

  if (req.body.education) {
    req.body.education = req.body.education.concat(user.education);
  }

  if (req.body.occupation) {
    req.body.occupation = req.body.occupation.concat(user.occupation);
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

exports.updatePassword = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const isOldPasswordMatch = await user.matchPassword(req.body.oldPassword);
  if (!isOldPasswordMatch) {
    return next(new ErrorResponse("Wrong old password", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});
