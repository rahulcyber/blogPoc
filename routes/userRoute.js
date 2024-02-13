const express = require("express");
const { userList, userCreate, userUpdate, userLogin } = require("../controllers/userController");
const router = express.Router();

router.get("/getUserList", userList);
router.post("/userCreate", userCreate);
router.post("/userUpdate", userUpdate);
router.post("/userLogin", userLogin);

module.exports = router;
