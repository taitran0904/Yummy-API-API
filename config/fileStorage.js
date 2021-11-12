const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');
const { formatName } = require('../utils/functions');

exports.configStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname === 'photos') {
      console.log(file);
      callback(null, './uploads/user/posts');
    }
    if (file.fieldname === 'avatar') {
      callback(null, './uploads/user/avatar');
    }
    if (file.fieldname === 'cover_photo') {
      callback(null, './uploads/user/coverPhoto');
    }
  },
  filename: (req, file, callback) => {
    if (file.fieldname === 'photos') {
      callback(null, formatName('post', file.mimetype.split('/')[1]));
    }
    if (file.fieldname === 'avatar') {
      callback(null, formatName('avatar', file.mimetype.split('/')[1]));
    }
    if (file.fieldname === 'cover_photo') {
      callback(null, formatName('cover', file.mimetype.split('/')[1]));
    }
  },
});

exports.fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    const error = new ErrorResponse('Not supported file type', 415);
    callback(error, false);
  }
};
