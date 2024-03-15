var express = require("express");
var router = express.Router();

var usersRouter = require("./users");
var partiesRouter = require("./parties");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).json({ msg: "Hello" });
});

router.use("/users", usersRouter);
router.use("/parties", partiesRouter);
module.exports = router;
