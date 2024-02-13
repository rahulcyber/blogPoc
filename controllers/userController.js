const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.userList = async (req, res) => {
  const users = await User.find();
  return res.send({
    status: 200,
    message: "User list fetch successfully.",
    data: users,
  });
};

exports.userCreate = async (req, res) => {
  const userExist = await User.aggregate([
    { $match: { email: req.body.email, username: req.body.username } },
    { $count: "userCount" },
  ]);

  if (userExist[0] && userExist[0].userCount > 0)
    return res.send({ status: 400, message: "User already exists!" });

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    userType: req.body.userType || "USER",
    password: await hashPassword(req.body.password),
  });

  user
    .save(user)
    .then((data) => {
      return res.send({
        status: 200,
        message: "User create successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating a user",
      });
    });
};

exports.userUpdate = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    userType: req.body.userType || "USER",
    password: await hashPassword(req.body.password),
  });

  return res.send({
    status: 200,
    message: "User update successfully.",
    data: user,
  });
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ status: 400, message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.send({ status: 400, message: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "12h",
  });
  return res.send({
    status: 200,
    message: "Login successfully.",
    data: user,
    token: token,
  });
};
