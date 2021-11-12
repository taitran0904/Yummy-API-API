const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      trim: true,
    },
    public: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], //0 : public, 1: friends only, 2: only me
    },
    status: {
      type: String,
      default: 'none',
      enum: ['none', 'happy', 'sad', 'angry', 'surprise'],
    },
    photos: [String],
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.pre('remove', async function () {
  await this.model('Comment').deleteMany({ post: this._id });
});

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

module.exports = mongoose.model('Post', PostSchema);
