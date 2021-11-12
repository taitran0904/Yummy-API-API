const jwt = require('jsonwebtoken');
const handleAsync = require('./handleAsync');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

module.exports = handleAsync(async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authenticated'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authenticated'));
  }
});
