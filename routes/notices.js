var express = require("express");
var router = express.Router();

const noticeService = require("../services/noticeService.js");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");

// 전체 알림내역
router.get("/allnoti", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
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

// 안 읽은 알림 갯수 조회
router.get("/checkunread", jwtAuthenticator, async (req,res,next) => {
  try{
    const userKey = req.jwt.payload.key;
    const notices_cnt = await noticeService.checkUnNotification(userKey)

    return res.status(200).json(notices_cnt)
  }catch(err){
    console.log(err)
  }
})

// 알림 삭제
router.delete("/:notificationKey/delete", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    const notificationKey = req.params.notificationKey
    console.log(userKey);
    const notices = await noticeService.getDelNotifications(notificationKey);

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
    const notificationKey = req.body.notificationKey;
    const notice = await noticeService.checkNotification(notificationKey);
    return res.status(200).json({
      msg: "Check Notification",
      result: notice,
    });
  } catch (err) {
    console.error(err);
  }
});
// 알림 전체 확인
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