var express = require("express");
var router = express.Router();
// validator
const { body, param, oneOf } = require("express-validator");
const { validatorErrorHanlder } = require("../middlewares/validator.js");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");

// without service layer
const { jwt } = require("../modules/");

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

      const resBody = {
        msg: "Success",
        result: result,
      };

      return res.status(200).json(resBody);
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

// [POST] logout
router.post("/logout", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verified = await jwt.verify(token);

    console.log(verified.key);

    return res.status(200).json({ msg: "Done" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "WrongTokenFormatError" ||
      error.name === "EmptyTokenError"
    ) {
      res.status(400).json({ msg: "invalid token" });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ msg: "Unauthorized" });
    } else {
      res.status(500).json({ msg: error });
    }

    return res;
  }
});

router.put(
  "/:userKey",
  [
    param("userKey").isNumeric(),
    oneOf([
      body("name").exists(),
      body("password").exists(),
      body("phoneNumber").exists(),
      body("birth").exists(),
    ]),
    validatorErrorHanlder,
  ],
  jwtAuthenticator,
  async (req, res, next) => {
    try {
      if (req.params.userKey != req.jwt.payload.key) {
        throw {
          name: "UnauthorizedAccessError",
          message: "unauthorized access",
        };
      }
      const result = await userService.modify(req.params.userKey, req.body);

      if (result == 1) {
        res.status(200).json({ msg: "Modified", result: result });
      } else {
        res.status(404).json({ msg: `${req.params.userKey} does not exists` });
      }
      return res;
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeDatabaseError") {
        res.status(400).json({ msg: error });
      } else if (error.name === "UnauthorizedAccessError") {
        res.status(401).json({ msg: "Unauthorized" });
      } else {
        res.status(500).json({ msg: "Error" });
      }
      return res;
    }
  }
);

module.exports = router;
