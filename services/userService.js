// controllers/tutorial.controller.js
const { db, jwt } = require("../modules");
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

/**
 * check wether given email exists or not
 * @param {String} email email
 * @returns {Promise<boolean>} available or not
 */
module.exports.checkEmail = async (email) => {
  const res = await User.findOne({
    where: {
      email: email,
    },
  });

  return res === null ? true : false;
};

/**
 * login
 * @param {*} loginDto email, password
 * @returns {Promise<*>} user info with access & refresh token
 * @throws IncorrectPasswordError
 */
module.exports.login = async (loginDto) => {
  const user = await User.findOne({
    where: {
      email: loginDto.email,
    },
  });

  if (!user || user.password !== loginDto.password) {
    throw { name: "IncorrectPasswordError", message: "Incorrect password" };
  }

  // TODO: get group list and role
  const groupList = [];

  // create token
  const tokens = await jwt.sign(user.userKey, groupList, user.name);

  return {
    name: user.name,
    userKey: user.userKey,
    birth: user.birth,
    phoneNumber: user.phoneNumber,
    ...tokens,
  };
};

/**
 * modify user info
 * @param {Number} userKey user identifier
 * @param {*} modifyUserDto must contain at least one of name, password, phoneNumber, birth
 * @returns modified count
 * @throws SequelizeDatabaseError invalid input
 */
module.exports.modify = async (userKey, modifyUserDto) => {
  const result = await User.update(
    { ...modifyUserDto },
    { where: { userKey: userKey } }
  );

  console.log(result);

  return result;
};

/**
 * delete user
 * @param {*} userKey user identifier
 * @returns number of modified row
 */
module.exports.delete = async (userKey) => {
  const result = await User.destroy({ where: { userKey: userKey } });

  console.log(result);
  return result;
}