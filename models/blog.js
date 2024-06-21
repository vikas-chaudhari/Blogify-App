const { Schema, model } = require("mongoose");

const blogSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const blogModel = model("blogs", blogSchema);

module.exports = {
  blogModel,
};
