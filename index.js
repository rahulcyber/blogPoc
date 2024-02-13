const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT;
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const { verify } = require("./middleware/auth");

app.use(bodyParser.json());

app.use("/api/user", userRoute);
app.use("/api/post", verify, postRoute);
app.use("/api/comments", verify, commentRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
