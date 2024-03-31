const axios = require("axios");
const { refreshToken } = require("../utils/refreshToken");

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
// use default TOKEN
const TOKEN = process.env.TOKEN;
// can init at app startup
const INIT_AT_STARTUP = process.env.INIT_AT_STARTUP || "";

const instance = axios.create({
  baseURL: process.env.KIS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${TOKEN}`,
    appkey: `${APP_KEY}`,
    appsecret: `${APP_SECRET}`,
    tr_id: `FHKST01010100`, // inquire
  },
});

/**
 * Init at App startup
 */
const initToken = async () => {
  const token = await refreshToken(APP_KEY, APP_SECRET);
  console.log(`KIS API axios instance initiated with token : ${token}`);
  instance.interceptors.request.use(function (request) {
    request.headers.authorization = `Bearer ${token}`;

    return request;
  })

}

// Refresh TOKEN at startup
if (INIT_AT_STARTUP == "INIT") {
  initToken();
}

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