const jwt = require("jsonwebtoken");
const secretKey = require("../app/config/jwt.config").secretKey;
const options = require("../app/config/jwt.config").options;

/**
 * creates token based on jwt.config
 * @param {*} userKey user identifier
 * @param {*} groups group list and roles
 * @param {*} name user's name
 * @returns {Promise<*>} access token and refresh token
 */
module.exports.sign = async (userKey, groups, name) => {
  const payload = {
    key: userKey,
    groups: groups,
    name: name,
  };

  return {
    accessToken: jwt.sign(payload, secretKey, { expiresIn: options.expiresIn }),
    refreshToken: jwt.sign(payload, secretKey, {
      expiresIn: options.expiresIn,
    }),
  };
};

/**
 *
 * @param {*} token
 * @returns
 */
module.exports.verify = async (token) => {
  try {
    if (!token) throw { name: "EmptyTokenError", message: "Token is empty" };
    const verified = jwt.verify(token, secretKey);

    return verified;
  } catch (error) {
    console.log(error);
    return null;
  }
};
