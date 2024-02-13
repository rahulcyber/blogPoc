const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    sub_title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
