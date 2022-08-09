var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var Post = require("../models/Post");
const Pusher = require("pusher");
const { verifytoken } = require("./auth");
const pusher = new Pusher({
  appId: "1459160",
  key: "d0fbdfbd3a54091bb50d",
  secret: "7aee7d4c989027a13f9d",
  cluster: "eu",
  useTLS: true,
});

//CRUD OPerations
//get all posts
router.get("/", verifytoken, async function (req, res, next) {
  try {
    const posts = await Post.find()
      .populate("author comments.author")
      .sort({ createdDate: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//a post of certain author
router.get("/author/:id", verifytoken, async function (req, res, next) {
  try {
    const posts = await Post.find({
      author: req.params.id,
    })
      .populate("author")
      .sort({ updatedAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//get a certain post
router.get("/:id", verifytoken, async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author comments.author",
      "fullname"
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add a post
router.post("/", verifytoken, async function (req, res, next) {
  const post = new Post(req.body);

  try {
    const postToSave = await post.save();
    await post.populate("author");
    pusher.trigger("posts", "addpost", {
      post: post,
    });
    res.status(200).json(postToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// add a comment
router.post("/:id/comment", verifytoken, async function (req, res, next) {
  const comment = req.body;
  try {
    var post = await Post.findById(req.params.id);
    post.comments.push(comment);
    await post.save();
    await post.populate("author comments.author");
    pusher.trigger("posts", "addcomment", {
      post: post,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// add a like
router.post("/:id/like", verifytoken, async function (req, res, next) {
  const userID = req.body.userID;
  try {
    var post = await Post.findById(req.params.id);
    const index = post.likes.findIndex((element) => element.user == userID);
    if (index === -1) {
      post.likes.push({ user: userID });
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    await post.populate("author comments.author");
    res.status(200).json(post);
    pusher.trigger("posts", "postChange", {
      post: post,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//delete a post
router.delete("/:id", verifytoken, async function (req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      res.status(404).send({
        message: `post was not found!`,
      });
    }
    pusher.trigger("posts", "postDelete", {
      deletedPost: deletedPost,
    });
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// update a post
router.put("/:id", verifytoken, async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const updatedPost = await Post.findByIdAndUpdate(id, updatedData, options);
    await updatedPost.populate("author comments.author");
    pusher.trigger("posts", "postChange", {
      post: updatedPost,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
