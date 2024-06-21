require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { connect } = require("mongoose");
const cookieParser = require("cookie-parser");
const { blogModel } = require("./models/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();

connect(process.env.URI).then(() => {
  console.log("DB connected!");
});

app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(checkForAuthenticationCookie("token"));
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, resp) => {
  const blogs = await blogModel.find({});
  resp.render("home", { currentUser: req.currentUser, blogs });
});

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
