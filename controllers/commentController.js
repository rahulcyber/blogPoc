const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

exports.createComment = async (req, res) => {
  try {
    const { content, authUserId, postId } = req.body;
    const author = await User.findById(authUserId);
    if (!author) {
      return res.send({ status: 400, message: "Author not found" });
    }
    if (!postId) {
      return res.send({ status: 400, message: "Invalid post id." });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.send({ status: 400, message: "Post not found" });
    }
    const comment = new Comment({ content, author: authUserId, post: postId });
    await comment.save();
    return res.send({
      status: 200,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.send({ status: 500, message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const commentDelete = await Comment.findByIdAndDelete(commentId);
  if (!commentDelete) {
    return res.send({ status: 400, message: "Comment not found." });
  }
  return res.send({ status: 200, message: "Comment deleted successfully." });
};

exports.postComments = async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comment.find({ post: postId }).populate("author");
  return res.send({ status: 200, message: "Comment List.", data: comments });
};
