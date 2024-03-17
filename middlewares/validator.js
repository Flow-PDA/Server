const { validationResult } = require("express-validator");

exports.validatorErrorHanlder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "invalid request", errors: errors.array() });
  }
  next();
};
