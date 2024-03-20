var express = require("express");
var router = express.Router();

var usersRouter = require("./users");
var partiesRouter = require("./parties");
var transfersRouter = require("./transfer");
var stocksRouter = require("./stocks");
var noticeRouter = require("./notices");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ msg: "Hello" });
});

router.use("/users", usersRouter);
router.use("/parties", partiesRouter);
router.use("/transfers", transfersRouter);
router.use("/stocks", stocksRouter);
router.use("/notifications", noticeRouter);

module.exports = router;
