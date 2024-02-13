const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.verify = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.json({
        status: 400,
        message: "Token not found",
        data: null,
      });
    }

    // Token verification

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    // Logging decoded token excluding circular references
    const { userId, iat, exp } = decoded;
    req.body.authUserId = userId;
    // console.log("decoded", { userId, iat, exp });

    // Check if the token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return res.send({
        status: 403,
        message: "Token expired",
        data: null,
      });
    }

    // Token is valid, proceed to the next middleware
    next();
  } catch (error) {
    return res.send({
      status: 403,
      message: "Token invalid",
      data: error.message,
    });
  }
};
