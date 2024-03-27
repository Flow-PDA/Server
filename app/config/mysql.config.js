const dotenv = require("dotenv");
dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;

module.exports = {
  HOST: MYSQL_HOST,
  port: MYSQL_PORT,
  USER: MYSQL_USER,
  PASSWORD: MYSQL_PASS,
  DB: "flow",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
