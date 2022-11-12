const express = require("express");
const router = express.Router();
const company = require("../models/company");
const users = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { memberEmail, password } = req.body;
  await users.create({ memberEmail, password });
  res.status(201).json({ messaage: "회원가입" });
});

router.post("/companySignup", async (req, res) => {
  const { companyEmail, companyPassword, companyAdmin } = req.body;
  await company.create({ companyEmail, companyPassword, companyAdmin });
  res.status(201).json({ messaage: "회원가입" });
});

router.post("/login", async (req, res) => {
  const { memberEmail, password } = req.body;

  try {
    const findUser = await users.findOne({ memberEmail });
    // console.log("######user", findUser);

    if (!findUser || password != findUser.password) {
      res
        .status(400)
        .json({ errorMessage: "아이디 또는 패스워드를 확인해주세요." });
      return;
    }
    const token = jwt.sign(
      { id: findUser._id },
      process.env.JWT_SECRET
    );
    console.log("######", token);
    res.send({
      token: `Bearer ${token}`,
      _id: findUser._id,
      memberEmail: findUser.memberEmail, // 있어도 그만 없어도 그만 일단 확인
    });
  } catch (err) {
    res.send(err.messaage);
  }
});

router.post("/companyLogin", async (req, res) => {
  const { companyEmail, companyPassword, companyAdmin } = req.body;

  try {
    const findCompany = await company.findOne({ companyAdmin });
    console.log("######user", findCompany);

    if (!findCompany || companyPassword != findCompany.companyPassword) {
      res
        .status(400)
        .json({ errorMessage: "아이디 또는 패스워드를 확인해주세요." });
      return;
    }
    const token = jwt.sign(
      { id: findCompany._id, companyAdmin: findCompany.companyAdmin },
      process.env.JWT_SECRET
    );
    console.log("######", token);
    res.send({
      token: `Bearer ${token}`,
      _id: findCompany._id,
      companyAdmin: findCompany.companyAdmin, // 있어도 그만 없어도 그만 일단 확인
    });
  } catch (err) {
    res.send(err.messaage);
  }
});

module.exports = router;
