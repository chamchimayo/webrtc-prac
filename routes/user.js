const express = require("express");
const router = express.Router();
const company = require("../models/company");
const users = require("../models/user");
const jwt = require("../jwt/jwt-util");
const refresh = require("../jwt/refresh");
const refreshModel = require("../models/refresh");

router.get("/refresh", refresh, (req, res) => {});

router.post("/signup", async (req, res) => {
  const { memberEmail, password } = req.body;
  await users.create({ memberEmail, password });
  res.status(201).json({ messaage: "회원가입" });
});

router.post("/companySignup", async (req, res) => {
  const { companyEmail, password } = req.body;
  await company.create({ companyEmail, password });
  res.status(201).json({ messaage: "회원가입" });
});

router.post("/login", async (req, res) => {
  const { memberEmail, password } = req.body;

  // try {
  const findUser = await users.findOne({ memberEmail });

  if (!findUser || password != findUser.password) {
    res
      .status(400)
      .json({ errorMessage: "아이디 또는 패스워드를 확인해주세요." });
    return;
  }
  console.log(findUser);
  const accessToken = jwt.sign(findUser);
  const refreshToken = jwt.refresh(findUser);
  await refreshModel.create({ refreshToken: `Bearer ${refreshToken}` });
  res.status(200).json({
    data: {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    },
  });
  // } catch (err) {
  //   res.send(err.messaage);
  // }
});

module.exports = router;
