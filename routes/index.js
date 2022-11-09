const express = require("express");
const router = express.Router();
const userRouter = require("./user");
// const roomRouter = require("./room");
// const MembersRouter = require('./members.routes');
// const AccommodationsRouter = require('./accommodations.routes');
// const ReviewsRouter = require('./reviews.routes');
// const LikesRouter = require('./likes.routes')
// const ReservationsRouter = require('./reservations.routes')
// const NotificationsRouter = require('./notifications.routes')
//전역 미들웨어
router.use("/members", userRouter);
// router.use("/room", roomRouter);
// router.use("/members", MembersRouter);
// router.use("/accommodations", AccommodationsRouter);
// router.use("/reviews", ReviewsRouter);
// router.use("/likes", LikesRouter);
// router.use("/reservations", ReservationsRouter);
// router.use("/notifications", NotificationsRouter);

module.exports = router;
