var express = require("express");
var router = express.Router();

// without service layer
const { db } = require("../modules/");
const User = db.Users;

// with service layer
const userService = require("../services/userService.js");

// [POST] signup
router.post("/signup", async (req, res, next) => {
  try {
    const userDto = req.body;

    // using service layer
    // const result = await userService.signup(userDto);

    // without service layer
    const result = await User.create(userDto);

    const resBody = {
      msg: "Created",
      result: result,
    };

    return res.status(201).json(resBody);
  } catch (err) {
    // error handling
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] get user list - sample
router.get("/", async (req, res, next) => {
  try {
    // without service layer
    const result = await User.findAll();

    const resBody = {
      msg: "조회 결과",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

module.exports = router;
