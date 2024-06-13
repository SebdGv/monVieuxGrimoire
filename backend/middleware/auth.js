const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    User.findOne({ _id: userId }).then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.auth = {
        userId: userId,
      };
      next();
    });
  } catch (error) {
    res.status(401).json({ error });
  }
};
