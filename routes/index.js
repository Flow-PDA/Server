var express = require("express");
var router = express.Router();

var usersRouter = require("./users");
const interestStockRouter = require("./interestStock");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ msg: "Hello" });
});

router.use("/users", usersRouter);
router.use("/interests", interestStockRouter);

module.exports = router;
