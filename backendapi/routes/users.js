var express = require("express");
var router = express.Router();
var User = require("../models/User");
const Post = require("../models/Post");
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: "1459160",
  key: "d0fbdfbd3a54091bb50d",
  secret: "7aee7d4c989027a13f9d",
  cluster: "eu",
  useTLS: true,
});

//CRUD OPerations
router.get("/", async function (req, res, next) {
  try {
    const users = await User.find({}).populate("friends.user");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async function (req, res, next) {
  const user = new User(req.body);
  try {
    const userToSave = await user.save();
    res.status(200).json(userToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/", async function (req, res, next) {
  const deletedusers = await User.deleteMany();
  const deleteduserss = await Post.deleteMany();

  if (!deletedusers) {
    res.status(404).send({
      message: `Cannot delete all users `,
    });
  }
  res.json({ deletedusers });
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    const deleteduser = await User.findByIdAndDelete(id);
    if (!deleteduser) {
      res.status(404).send({
        message: `user was not found!`,
      });
    }
    res.status(200).json({ deleteduser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async function (req, res, next) {
  const user = await User.findById(req.params.id);
  try {
    const id = req.params.id;
    const updatedData = req.body;
    console.log(updatedData);
    const options = { new: true };
    const updateduser = await User.findByIdAndUpdate(id, updatedData, options);
    pusher.trigger("users", "edituser", {
      user: updateduser,
    });
    res.status(200).json(updateduser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/invitations/:id", async function (req, res, next) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    await user.populate("invitations.user");
    res.send(user.invitations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/invitations/:id", async function (req, res, next) {
  try {
    const userId_to = req.params.id;
    const userId = req.body.userId;
    const user_to = await User.findById(userId_to);
    user_to.invitations.push({ user: userId });
    await user_to.save();
    await user_to.populate("invitations.user friends.user");
    pusher.trigger("invitations", "sendInvitation", {
      user: user_to,
    });
    res.status(200).json(user_to);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/InvitationConfirmation/:id", async function (req, res, next) {
  try {
    const userId_toinv = req.params.id;
    const userId = req.body.userId;
    const user_me = await User.findById(userId);
    const user = await User.findById(userId_toinv);
    user_me.invitations = user_me.invitations.filter(
      (x) => x.user != userId_toinv
    );
    user_me.friends.push({ user: userId_toinv });
    user.friends.push({ user: userId });
    await user_me.save();
    await user.save();
    await user_me.populate("friends.user invitations.user");
    pusher.trigger("invitations", "confirmInvitation", {
      user: user,
      user_me: user_me,
    });
    res.json(user_me);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/InvitationCancel/:id", async function (req, res, next) {
  try {
    const userId_toinv = req.params.id;
    const userId = req.body.userId;
    const user_me = await User.findById(userId);
    user_me.invitations = user_me.invitations.filter(
      (x) => x.user != userId_toinv
    );
    await user_me.save();
    await user_me.populate("invitations.user");
    pusher.trigger("invitations", "cancelInvitation", {
      user_me: user_me,
    });
    res.json(user_me);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
