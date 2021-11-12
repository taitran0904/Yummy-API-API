const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    username: {
      type: String,
      required: [true, "Please enter a name"],
    },
    // nick_name: String,
    // occupation: {
    //   type: [{ position: String, at: String }],
    //   default: [],
    // },
    // education: {
    //   type: [
    //     { school: String, level: String, major: String, from: Date, to: Date },
    //   ],
    //   default: [],
    // },
    // live_in: {
    //   type: String,
    //   default: null,
    // },
    from: {
      type: String,
      default: null,
    },
    cover_photo: {
      type: String,
      default: "no-photo",
    },
    avatar: {
      type: String,
      default: "no-photo",
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      max: 50,
    },
    friends: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(this.password, salt);
  this.password = hashed;
});

UserSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
    algorithm: "HS512",
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
