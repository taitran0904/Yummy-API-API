const multer = require('multer');
const express = require('express');
const router = express.Router();
const { configStorage, fileFilter } = require('../config/fileStorage');
const upload = multer({ storage: configStorage, fileFilter });

const {
  login,
  register,
  getInfo,
  updateInfo,
  updatePassword,
} = require('../controllers/auth');
const auth = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/info', auth, getInfo);
router.put(
  '/info/update',
  auth,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 },
  ]),
  updateInfo
);
router.put('/info/password/update', auth, updatePassword);

module.exports = router;
