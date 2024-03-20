var express = require("express");
var router = express.Router();

const noticeService = require("../services/noticeService.js");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");

// 알림내역
router.get("/", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    console.log(userKey);
    const notices = await noticeService.getNotifications(userKey);

    const resBody = {
      msg: "Notification retrieval successful.",
      result: notices,
    };

    if (resBody) {
      return res.status(200).json(resBody);
    } else {
      return res.status(404).json({ msg: "Notification Not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Notification retrieval fail." });
  }
});

//알림 한개씩 확인
router.put("/", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    const notificationKey = req.body.key;
    const notice = await noticeService.checkNotification(notificationKey);
    return res.status(200).json({
      msg: "Check Notification",
      result: notice,
    });
  } catch (err) {
    console.error(err);
  }
});

router.put("/readAll", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    console.log(userKey);
    const notices = await noticeService.checkAllNotification(userKey);

    if (notices) {
      return res.status(200).json({
        msg: "Check All Notification.",
      });
    } else {
      return res.status(404).json({
        msg: "Undefined Notification.",
      });
    }
  } catch (error) {
    console.error(err);
  }
});

module.exports = router;
