// controllers/tutorial.controller.js
const { db } = require("../modules");
const User = db.Users;

/**
 * create user
 * @param {*} userDto email, name, password, phoneNumber, birth are required
 * @returns created User info
 * @throws SequelizeUniqueConstraintError - if email already exists
 */
module.exports.signup = async (userDto) => {
  // console.log(userDto);
  const res = await User.create(userDto);
  // console.log(res);
  return res.dataValues;
};
