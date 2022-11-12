const jwt = require("jsonwebtoken");
const users = require("../models/user");
require("dotenv").config();

// 미들웨어 - 사용자인증 (sequelize 변경)
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("authorization: ", authorization);
  const [authType, authToken] = (authorization || "").split(" ");
  console.log(authType);
  console.log(authToken);
  if (authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "이용할 수 없습니다.",
    });
    return;
  }

  try {
    const { id } = jwt.verify(authToken, process.env.JWT_SECRET);
    users.findById(id).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
