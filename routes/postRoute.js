const express = require("express");
const multer = require("multer");
const path = require("path"); // Add this line to import the 'path' module
const {
  getPostsList,
  createPost,
  updatePost,
  deletePost,
  getPostById,
} = require("../controllers/postController");
const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending timestamp to filename to ensure uniqueness
  },
});

const upload = multer({ storage: storage });

router.get("/getPosts", getPostsList);
router.post("/createPost", createPost);
router.get("/getPostById/:id", getPostById);
router.put("/updatePost", updatePost);
router.delete("/deletePost/:id", deletePost);
module.exports = router;
