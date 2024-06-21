const { Router } = require("express");
const multer = require("multer");
const { blogModel } = require("../models/blog");
const { commentModel } = require("../models/comments");

const path = require("path");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/uploads/`);
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, resp) => {
  resp.render("addBlog", { currentUser: req.currentUser });
});

router.get("/:id", async (req, resp) => {
  const blog = await blogModel
    .findOne({ _id: req.params.id })
    .populate("createdBy");

  const allComments = await commentModel
    .find({ commentedOn: req.params.id })
    .populate("commentedBy");
  // console.log("all comments ====", allComments);
  resp.render("blog", {
    currentUser: req.currentUser,
    blog,
    user: blog.createdBy,
    allComments,
    commenteBy: allComments,
  });
});

router.post("/addblog", upload.single("coverImage"), async (req, resp) => {
  const blogData = await blogModel.create({
    ...req.body,
    coverImageUrl: `uploads/${req.file.filename}`,
    createdBy: req.currentUser.id,
  });
  resp.redirect(`/blog/${blogData._id}`);
});

router.post("/comments/:id", async (req, resp) => {
  const data = {
    comment: req.body.comment,
    commentedBy: req.currentUser.id,
    commentedOn: req.params.id,
  };
  const commentData = await commentModel.create(data);
  console.log(commentData);

  resp.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
