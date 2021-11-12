const Comment = require('../models/Comment');
const Post = require('../models/Post');
const handleAsync = require('../middlewares/handleAsync');
const ErrorResponse = require('../utils/errorResponse');

exports.getCommentsOnPost = handleAsync(async (req, res, next) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate({
      path: 'post',
      select: '_id body',
    })
    .populate({
      path: 'user',
      select: '_id name avatar',
    })
    .populate({
      path: 'reaction.user',
      select: '_id name avatar',
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

exports.commentPost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  let newComment = await Comment.create({
    ...req.body,
    post: req.params.postId,
    user: req.user._id,
  });

  newComment = await newComment
    .populate({
      path: 'user',
      select: '_id name avatar',
    })
    .execPopulate();

  res.status(200).json({
    success: true,
    data: newComment,
  });
});

exports.editComment = handleAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  let comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (`${comment.post}` !== `${postId}`) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (
    `${comment.user}` !== `${req.user._id}` &&
    `${post.user}` !== `${req.user._id}`
  ) {
    return next(new ErrorResponse('This comment does not belong to you'));
  }
  comment = await Comment.findByIdAndUpdate(commentId, req.body, {
    new: true,
    runValidators: true,
  });

  comment = await comment
    .populate({
      path: 'user',
      select: '_id name avatar',
    })
    .execPopulate();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.deleteComment = handleAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  let comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (`${comment.post}` !== `${postId}`) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (
    `${comment.user}` !== `${req.user._id}` &&
    `${post.user}` !== `${req.user._id}`
  ) {
    return next(new ErrorResponse('This comment does not belong to you'));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.reactToComment = handleAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  let comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (`${comment.post}` !== `${postId}`) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  const isReacted = comment.reaction.findIndex(
    (i) => `${i.user}` === `${req.user._id}`
  );

  if (isReacted !== -1) {
    comment.reaction = comment.reaction.filter(
      (i) => `${i.user}` !== `${req.user._id}`
    );
    console.log(comment.reaction[isReacted]);
    if (comment.reaction[isReacted].type !== req.body.react_type) {
      comment.reaction[isReacted].type = req.body.react_type;
    } else {
      comment.reaction = comment.reaction.filter(
        (i) => `${req.user._id}` !== `${i.user}`
      );
    }
  } else {
    comment.reaction.unshift({ type: req.body.reactType, user: req.user._id });
  }

  await comment.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getCommentReaction = handleAsync(async (req, res, next) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  let comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  if (`${comment.post}` !== `${postId}`) {
    return next(new ErrorResponse('Comment not found', 404));
  }

  const commentReaction = await Comment.findById(commentId)
    .select('reaction')
    .populate({
      path: 'reaction.user',
      select: '_id name profilePic',
    });

  res.status(200).json({
    success: true,
    count: commentReaction.reaction.length,
    data: commentReaction.reaction,
  });
});
