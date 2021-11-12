const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accept'],
    default: 'pending',
  },
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
