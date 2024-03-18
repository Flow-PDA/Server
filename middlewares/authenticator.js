const { jwt } = require("../modules");

/**
 * jwt authenticator. Append token payload at req.jwt.payload
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns 401 Unauthorized for unauthorized Token
 */
exports.jwtAuthenticator = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    const verified = await jwt.verify(bearerToken);

    req.jwt = {};
    req.jwt.payload = verified;
    return next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ msg: "jwtAuthenticator : Unauthorized", cause: error.name });
    return res;
  }
};
