const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  secretKey: process.env.JWT_SECRET || "JWT_SECRET_KEY",
  options: {
    algorithm: "HS256",
    expiresIn: 60 * 60 * 24,
    refreshTokenExpiresIn: 60 * 60 * 24 * 7,
  },
};
