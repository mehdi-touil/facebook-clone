var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Pusher = require("pusher");
const { verifytoken } = require("./auth");
const pusher = new Pusher({
  appId: "1459160",
  key: "d0fbdfbd3a54091bb50d",
  secret: "7aee7d4c989027a13f9d",
  cluster: "eu",
  useTLS: true,
});


router.get("/", async function (req, res, next) {
  try {
    const conversations = await Conversation.find();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", verifytoken, async function (req, res, next) {
  const userA = req.body.senderID;
  const userB = req.body.receiverID;
  try {
    const conversations = await Conversation.find({
      $or: [
        { senderID: userA, receiverID: userB },
        { senderID: userB, receiverID: userA },
      ],
    })
      .populate("senderID receiverID")
      .sort({ createdDate: 1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/newconversation", verifytoken, async function (req, res, next) {
  try {
    const conversation = await Conversation.create(req.body);
    await conversation.populate("senderID receiverID");
    pusher.trigger("conversations", "addconversation", {
      conversation: conversation,
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
