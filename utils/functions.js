const uuid = require('uuid');
const fs = require('fs');

exports.formatName = (type, mimetype) => {
  const date = new Date();
  const randomId = uuid.v1().split('-')[0];
  const concatDateString = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  return `${type}_${randomId}_${concatDateString}.${mimetype}`;
};

exports.deleteFiles = (path, files) => {
  if (Array.isArray(files)) {
    files.forEach((file) => {
      try {
        fs.unlinkSync(`${path}/${file}`);
      } catch (err) {
        throw err;
      }
    });
  } else {
    try {
      fs.unlinkSync(`${path}/${files}`);
    } catch (err) {
      throw err;
    }
  }
};

exports.checkFileExists = (path, fileName) => {
  if (fs.existsSync(`${path}/${fileName}`)) {
    return true;
  } else {
    return false;
  }
};
