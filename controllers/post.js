const Post = require("../models/Post");
const handleAsync = require("../middlewares/handleAsync");
const ErrorResponse = require("../utils/errorResponse");
const { deleteFiles } = require("../utils/functions");

exports.getPosts = handleAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "user",
      select: "_id name avatar",
    })
    .populate({
      path: "reaction.user",
      select: "_id name avatar",
    })
    .populate({
      path: "comments",
      select: "_id",
    })
    .sort("-createdAt");
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

exports.getSinglePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
    .populate({
      path: "user",
      select: "_id name avatar",
    })
    .populate({
      path: "reaction.user",
      select: "_id name avatar",
    });

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    data: post,
  });
});

exports.createPost = handleAsync(async (req, res, next) => {
  const photos = req.files;
  const photoArr = photos.map((i) => i.filename);
  console.log(req.body);
  let post = await Post.create({
    ...req.body,
    user: req.user._id,
    photos: photoArr,
  });
  // post = await Post.populate({
  //   path: "user",
  //   select: "_id name avatar",
  // }).execPopulate();

  res.status(201).json({
    success: true,
    data: post,
  });
});

exports.deletePost = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  if (`${req.user._id}` !== `${post.user}`) {
    return next(new ErrorResponse("This post does not belong to you"));
  }

  deleteFiles("uploads/user/posts", post.photos);

  await post.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.updatePost = handleAsync(async (req, res, next) => {
  let photos = req.files;
  let post = await Post.findById(req.params.postId);
  let photoArr = [];
  if (photos.length > 0) {
    photoArr = photos.map((i) => i.filename);
    req.body.photos = post.photos.concat(photoArr);
  }

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  if (`${req.user._id}` !== `${post.user}`) {
    return next(new ErrorResponse("This post does not belong to you"));
  }

  post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
    new: true,
    runValidators: true,
  });

  post = await post
    .populate({
      path: "user",
      select: "_id name avatar",
    })
    .execPopulate();

  res.status(200).json({
    success: true,
    data: post,
  });
});

exports.reactToPost = handleAsync(async (req, res, next) => {
  let post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const isReacted = post.reaction.findIndex(
    (i) => `${req.user._id}` === `${i.user}`
  );
  if (isReacted !== -1) {
    if (post.reaction[isReacted].type !== req.body.react_type) {
      post.reaction[isReacted].type = req.body.react_type;
    } else {
      post.reaction = post.reaction.filter(
        (i) => `${req.user._id}` !== `${i.user}`
      );
    }
  } else {
    post.reaction.unshift({ type: req.body.react_type, user: req.user._id });
  }

  await post.save();

  res.status(201).json({
    success: true,
    data: {},
  });
});

exports.getPostReaction = handleAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const postReactions = await Post.findById(req.params.postId)
    .select("reaction")
    .populate({
      path: "reaction.user",
      select: "_id name avatar",
    });

  res.status(200).json({
    success: true,
    count: postReactions.reaction.length,
    data: postReactions.reaction,
  });
});
