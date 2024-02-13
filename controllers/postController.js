const Post = require("../models/post");
const User = require("../models/user");

exports.getPostsList = async (req, res) => {
  const posts = await Post.find({ author: req.body.authUserId });
  return res.send({
    status: 200,
    message: "Post list fetch successfully.",
    data: posts,
  });
};

exports.createPost = async (req, res) => {
  const author = await User.findById(req.body.authUserId);
  if (!author) {
    return res.send({ status: 400, error: "Author not found" });
  }
  console.log("req.body.title", req.body.title);
  const postExist = await Post.findOne({ title: req.body.title }).exec();
  console.log("postExist", postExist);
  if (postExist) {
    return res.send({ status: 400, error: "Post title already exist." });
  }
  let postData = {
    title: req.body.title,
    sub_title: req.body.sub_title,
    description: req.body.description,
    author: req.body.authUserId,
  };

  const post = new Post(postData);
  await post.save();
  return res.send({
    status: 200,
    message: "Post create successfully.",
    data: post,
  });
};

exports.updatePost = async (req, res) => {
  const { _id, title, sub_title, description } = req.body;
  const post = await Post.findById(_id);
  if (!post) {
    return res.send({ status: 404, message: "Post not found" });
  }

  post.title = title;
  post.sub_title = sub_title;
  post.description = description;

  const updatedPost = await post.save();
  return res.status(200).json({
    message: "Post updated successfully",
    data: updatedPost,
  });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, author: req.body.authUserId });
  if (!post) {
    return res.send({ status: 400, message: "Post not found" });
  }
  await Post.deleteOne({ _id: id });
  return res.send({ status: 200, message: "Post delete successfully." });
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, author: req.body.authUserId });
  if (!post) {
    return res.send({ status: 400, message: "Post not found" });
  }

  return res.send({
    status: 200,
    message: "Post fetch successfully.",
    data: post,
  });
};
