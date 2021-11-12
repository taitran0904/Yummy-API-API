const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const handleAsync = require('../middlewares/handleAsync');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

exports.getFriendRequest = handleAsync(async (req, res, next) => {
  const friendRequest = await FriendRequest.find({
    receiver: req.user._id,
    status: 'pending',
  }).populate({
    path: 'sender',
    select: '_id name',
  });

  res.status(200).json({
    success: true,
    count: friendRequest.length,
    data: friendRequest,
  });
});

exports.sendFriendRequest = handleAsync(async (req, res, next) => {
  const { receiverId } = req.params;

  if (`${req.user._id}` === `${receiverId}`) {
    return next(
      new ErrorResponse('You cannot send a friend request to yourself', 400)
    );
  }

  await FriendRequest.create({
    sender: req.user._id,
    receiver: receiverId,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.acceptFriendRequest = handleAsync(async (req, res, next) => {
  const { requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  if (`${friendRequest.receiver}` !== `${req.user._id}`) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  const sender = await User.findById(friendRequest.sender);

  sender.friends.unshift(req.user._id);

  const updatedSender = await sender.save();

  req.user.friends.unshift(mongoose.Types.ObjectId(updatedSender._id));

  await req.user.save();

  await friendRequest.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.declineFriendRequest = handleAsync(async (req, res, next) => {
  const { requestId } = req.params;

  const friendRequest = await FriendRequest.findById(requestId);

  if (!friendRequest) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  if (`${friendRequest.receiver}` !== `${req.user._id}`) {
    return next(new ErrorResponse('Friend request not found', 404));
  }

  await friendRequest.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
