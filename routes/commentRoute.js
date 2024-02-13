const express = require("express");
const {
  createComment,
  deleteComment,
  postComments,
} = require("../controllers/commentController");
const router = express.Router();

router.post("/createComment", createComment);
router.get("/posts/:postId/comments", postComments);
router.delete("/deleteComment/:id", deleteComment);
module.exports = router;
