const mongoose = require("mongoose");
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };
const PostSchema = new Schema(
  {
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    imageUrl: { type: String },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        timestamp: {
          type: String,
          default: () => new Date().toUTCString(),
        },
      },
    ],
    shares: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: {
          type: String,
          default: () => new Date().toUTCString(),
        },
      },
    ],
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: {
          type: String,
          default: () => new Date().toUTCString(),
        },
      },
    ],
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);
PostSchema.virtual("likecount").get(function () {
  return this.likes.length;
});
PostSchema.virtual("sharecount").get(function () {
  return this.shares.length;
});
PostSchema.virtual("commentcount").get(function () {
  return this.comments.length;
});
module.exports = mongoose.model("Post", PostSchema);
