var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { authRouter } = require("./routes/auth");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var conversationsRouter = require("./routes/conversations");

var cors = require("cors");
require("dotenv").config();
var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/conversations", conversationsRouter);
require("./db");
seed();
app.listen(process.env.PORT || "5000");
