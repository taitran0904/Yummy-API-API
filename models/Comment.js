const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Please at a content'],
      trim: true,
    },
    reaction: {
      type: [
        {
          user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
          },
          type: {
            type: String,
            enum: ['wow', 'love', 'haha', 'sad', 'angry'],
          },
        },
      ],
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
