const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  userID: String,
  email: String,
  fullname: String,
  imageProfileURL: String,
  coverProfileURL: String,
  isActive: Boolean,
  lastLoginDateTime: Date,
  info: {
    age: Number,
    description: String,
  },
  friends: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }],
  invitations: [
    { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
  ],
});
UserSchema.set("toJSON", { getters: true, virtuals: true });

module.exports = mongoose.model("User", UserSchema);
