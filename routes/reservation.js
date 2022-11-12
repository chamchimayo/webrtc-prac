const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const authCompanyMiddleware = require("../middleware/auth_company_middleware")

router.post("/reservation", authCompanyMiddleware, async (req, res) => {
  try {
    const { reservationDate } = req.body;
    const { companyAdmin } = res.locals.user;

    await Reservation.create({ reservationDate, companyAdmin });

    res.status(201).json({ messaage: "예약이 완료되었습니다." });

} catch (err) {
  res.send(err.messaage);
}
});

//   router.get("/reservation/:companyName", authMiddleware, async (req, res) => {

//   })



module.exports = router;