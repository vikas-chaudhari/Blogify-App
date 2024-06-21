const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { userModel } = require("../models/users");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/profile/`);
  },

  filename: function (req, file, cb) {
    // Avoiding whitespaces
    const fullName = req.body.fullName.replace(/\s/g, "");
    file.originalname = file.originalname.replace(/\s/g, "");

    console.log(fullName + "-" + file.originalname + "-" + req.body.email);

    const fileName = fullName + "-" + Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/signup", (req, resp) => {
  resp.render("signup");
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.get("/logout", (req, resp) => {
  resp.clearCookie("token").redirect("/");
});

router.post("/signup", upload.single("profileImage"), async (req, resp) => {
  console.log(req.body);
  const { fullName, email, password } = req.body;

  await userModel.create({
    fullName,
    profileImageUrl: `profile/${req.file.filename}`,
    email,
    password,
  });
  console.log("user created successfully");
  return resp.redirect("/");
});

router.post("/login", async (req, resp) => {
  const currentUser = req.body;
  console.log("user = ", req.body);
  const { email, password } = currentUser;
  const token = await userModel.matchPasswordAndGenerateToken(email, password);
  console.log("token : ", token);
  if (token) {
    return resp.cookie("token", token).redirect("/");
  }
  return resp.render("login", { error: "Incorrect password" });
});

module.exports = router;
