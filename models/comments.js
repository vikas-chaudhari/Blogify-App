const { Schema, model } = require("mongoose");

const commentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    commentedOn: {
      type: Schema.Types.ObjectId,
      ref: "blogs",
    },
  },
  { timestamps: true }
);

const commentModel = model("comments", commentSchema);

module.exports = {
  commentModel,
};
