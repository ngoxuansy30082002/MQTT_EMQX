const jwt = require("jsonwebtoken");

const authMiddleware = {
  //verify token
  verifyToken: (req, res, next) => {
    const token = `Bearer ${req.cookies.accessToken}`;
    if (token) {
      const accessToken = token.split(" ")[1]; //Bearer 123456 => accessToken = 123456
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err)
          return res.render("pages/login", {
            accessTokenErr: "Login session has expired",
          });
        else req.user = user;
        next();
      });
    } else {
      return res.render("pages/login", {
        accessTokenErr: "Login session has expired",
      });
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      // req.user.id == req.params.id ||
      if (req.user.admin) {
        next();
      } else {
        res.status(403).json("you are not allowed delete other");
      }
    });
  },
};
module.exports = authMiddleware;
