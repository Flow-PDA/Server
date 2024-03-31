const axios = require("axios");

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
const TOKEN = process.env.TOKEN;

const instance = axios.create({
  baseURL: process.env.KIS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${TOKEN}`,
    appkey: `${APP_KEY}`,
    appsecret: `${APP_SECRET}`,
    tr_id: `${TR_ID}`,
  },
});

/**
 * update token of authorized axios instance
 * @param {*} token
 */
const updateToken = (token) => {
  instance.interceptors.request.use(function (request) {
    request.headers.authorization = `Bearer ${token}`;

    return request;
  });
};

module.exports = { instance, updateToken };