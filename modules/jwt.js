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
    // groups: groups,
    name: name,
  };

  return {
    accessToken: jwt.sign({ ...payload, groups: groups }, secretKey, {
      expiresIn: options.expiresIn,
    }),
    refreshToken: jwt.sign(payload, secretKey, {
      expiresIn: options.expiresIn,
    }),
  };
};

/**
 * verify token
 * @param {*} bearerToken token string with Bearer. Can be found at req.headers.authorization
 * @returns key(userKey), name, iat, exp, groups(list of groups with role)
 * @throws TokenExpiredError expired token
 * @throws EmptyTokenError empty token
 * @throws WrongTokenFormatError wrong token format, Not a Bearer token
 * @trhows JsonWebTokenError invalid token
 */
module.exports.verify = async (bearerToken) => {
  // console.log(bearerToken);
  if (!bearerToken)
    throw { name: "EmptyTokenError", message: "Token is empty" };
  if (
    !bearerToken.startsWith("Bearer ") ||
    bearerToken.replace("Bearer ", "") == ""
  ) {
    throw { name: "WrongTokenFormatError", message: "Not a Bearer token" };
  }
  const token = bearerToken.replace("Bearer ", "");

  const verified = jwt.verify(token, secretKey);

  return verified;
};
