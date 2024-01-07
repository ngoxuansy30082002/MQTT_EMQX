const jwt = require("jsonwebtoken");

module.exports = {
  //   GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "30m",
      }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "365d",
      }
    );
  },
  generateEmailToken: (email) => {
    return jwt.sign(
      {
        email: email,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "10m",
      }
    );
  },
};
