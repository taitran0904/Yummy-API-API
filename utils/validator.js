const validator = require('validator');

exports.validateLoginInput = (email, password) => {
  let error = {};
  if (validator.isEmpty(email)) {
    error.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    error.email = 'Invalid email';
  }

  if (validator.isEmpty(password)) {
    error.password = 'Password is required';
  }

  return {
    isValid: Object.keys(error).length === 0,
    error: Object.values(error).map((e) => e),
  };
};
