var express = require("express");
require("dotenv").config();
var router = express.Router();
const jwt = require("jsonwebtoken");
var User = require("../models/User");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const verifytoken = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(403).send("Access denied.");

    const decoded = jwt.verify(token, process.env.JWT_SIGNIN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
router.post("/auth/facebook", function (req, res) {
  const { userID, accessToken } = req.body;
  let urlGraphFb = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
  fetch(urlGraphFb)
    .then((response) => response.json())
    .then((response) => {
      const { email, name } = response;
      User.findOne({ email }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) {
          return res.status(400).json({
            error: "somethig wrong!",
          });
        } else if (user) {
          user.populate("invitations.user friends.user");
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGNIN_KEY);
          res.json({ token, user: user });
        } else {
          User.create({
            fullname: response.name,
            email: response.email,
            imageProfileURL: response.picture.data.url,
            userID,
          }).then((newuser) => {
            const token = jwt.sign(
              { _id: newuser._id },
              process.env.JWT_SIGNIN_KEY,
              { expiresIn: "2h" }
            );
            res.json({ token, user: newuser });
          });
        }
      });
    });
});

module.exports = { authRouter: router, verifytoken };
