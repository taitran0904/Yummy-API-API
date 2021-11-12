const express = require('express');
const multer = require('multer');
const { configStorage, fileFilter } = require('../config/fileStorage');
const router = express.Router();
const upload = multer({ storage: configStorage, fileFilter });

const {
  getPosts,
  getSinglePost,
  createPost,
  deletePost,
  updatePost,
  reactToPost,
  getPostReaction,
} = require('../controllers/post');

const {
  commentPost,
  editComment,
  deleteComment,
  getCommentsOnPost,
  reactToComment,
  getCommentReaction,
} = require('../controllers/comment');

const auth = require('../middlewares/auth');

router.get('/', auth, getPosts);
router.get('/:postId', auth, getSinglePost);
router.post('/', auth, upload.array('photos'), createPost);
router.delete('/:postId', auth, deletePost);
router.put('/:postId', upload.array('photos'), auth, updatePost);

router.put('/:postId/react', auth, reactToPost);
router.get('/:postId/reactions', auth, getPostReaction);

router.get('/:postId/comments', auth, getCommentsOnPost);
router.post('/:postId/comments', auth, commentPost);
router.put('/:postId/comments/:commentId', auth, editComment);
router.delete('/:postId/comments/:commentId', auth, deleteComment);

router.put('/:postId/comments/:commentId/react', auth, reactToComment);
router.get('/:postId/comments/:commentId/reactions', auth, getCommentReaction);

module.exports = router;
