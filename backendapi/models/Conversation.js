const mongoose = require("mongoose");
const { Schema } = mongoose;
const opts = { toJSON: { virtuals: true } };
const conversationSchema = new Schema(
  {
    senderID: { type: Schema.Types.ObjectId, ref: "User" },
    receiverID: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);

module.exports = mongoose.model("Conversation", conversationSchema);
