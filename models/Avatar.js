const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Avatar must belong to an user"],
  },
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
});

const Avatar = mongoose.model("Avatar", avatarSchema);
module.exports = Avatar;
