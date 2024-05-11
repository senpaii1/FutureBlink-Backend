const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

// Middleware to authenticate user
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findOne({
      _id: decoded.userId,
      //   "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
