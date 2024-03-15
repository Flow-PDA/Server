var express = require("express");
var router = express.Router();
// validator
const { body, param } = require("express-validator");
const { validatorErrorHanlder } = require("../middlewares/validator.js");

// without service layer
const { db } = require("../modules/");
const User = db.Users;

// with service layer
const userService = require("../services/userService.js");

// [POST] signup
router.post(
  "/signup",
  [
    body("email").exists().isEmail(),
    body("name").exists().isLength({ max: 10 }),
    body("password").exists(),
    body("phoneNumber").exists(),
    body("birth").exists(),
    validatorErrorHanlder,
  ],
  async (req, res, next) => {
    try {
      const userDto = req.body;

      // using service layer
      const result = await userService.signup(userDto);

      // console.log(result);
      const resBody = {
        msg: "Created",
      };

      return res.status(201).json(resBody);
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ msg: "Email already exists" });
      } else {
        res.status(500).json({ msg: "ERROR MESSAGE" });
      }

      return res;
    }
  }
);

router.get(
  "/check/:email",
  [param("email").exists().isEmail(), validatorErrorHanlder],
  async (req, res, next) => {
    try {
      const email = req.params.email;
      const result = await userService.checkEmail(email);

      if (result) {
        res.status(200).json({ msg: "available" });
      } else {
        res.status(409).json({ msg: "exists" });
      }

      return res;
    } catch (err) {
      console.log(err);
      res.status(500).send();
      return res;
    }
  }
);

// [POST] login
router.post(
  "/login",
  [
    body("email").exists().isEmail(),
    body("password").exists(),
    validatorErrorHanlder,
  ],
  async (req, res, next) => {
    try {
      const loginDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await userService.login(loginDto);

      return res.status(200).json(result);
    } catch (error) {
      if (error.name === "IncorrectPasswordError") {
        res.status(401).json({ msg: "Unauthorized" });
      } else {
        res.status(500).json({ msg: error });
      }

      return res;
    }
  }
);

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
