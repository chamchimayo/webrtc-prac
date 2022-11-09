const express = require("express")
const router = express.Router()
const company = require("../models/company")
const users = require("../models/user")
const jwt = require('jsonwebtoken')

router.post("/members/signup", async (req, res) => {
    const {memberEmail, password} = req.body
    await users.create({memberEmail, password})
    res.status(201).json({messaage: "회원가입"})
})

router.post("/companySignup", async (req, res) => {
    const {companyEmail, password} = req.body
    await company.create({companyEmail, password})
    res.status(201).json({messaage: "회원가입"})
})

router.post("/members/login", async (req, res) => {
    const {memberEmail, password} = req.body

    try {
        const findUser = await users.findOne({memberEmail});
        console.log("######user", findUser);
        
        if(!findUser || password != findUser.password) {
            res.status(400).json({errorMessage: "아이디 또는 패스워드를 확인해주세요."})
            return;
        }
        const token = jwt.sign({ memberEmail: findUser.memberEmail }, process.env.JWT_SECRET);
        console.log("######", token);
        res.send({
            token: `Bearer ${token}`,
            memberEmail: findUser.memberEmail
        });
    } catch (err) {
        res.send(err.messaage);
    }
})

module.exports = router