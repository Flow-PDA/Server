const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  secretKey: process.env.JWT_SECRET,
  options: {
    algorithm: "HS256",
    expiresIn: 60 * 60 * 24,
  },
};
