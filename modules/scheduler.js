const schedule = require('node-schedule');
const { refreshToken } = require('../utils/refreshToken');
const { db, kisApi } = require("./index");
const Party = db.Parties;

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;

const CRON_PER_12H = '0 */12 * * *';
const CRON_PER_2M = '*/2 * * * *';

/**
 * shceduled job : refresh tokens of Party per 12H
 */
const resfreshTokens = schedule.scheduleJob(CRON_PER_12H, async function () {
  console.log("shceduler");
  // refresh Token of Parties at DB
  const parties = await Party.findAll();
  parties.forEach(async (elem) => {
    // console.log(elem.appKey);
    // console.log(elem.appSecret);
    if (elem.appKey && elem.appSecret) {
      const token = await refreshToken(elem.appKey, elem.appSecret);
      // console.log(elem.partyKey);
      if (!token && token != "") {
        console.log("update token", token);
        console.log({ ...elem, token: token })
        const result = await Party.update({ ...elem, token: token }, { where: { party_key: elem.partyKey } });
        console.log(result);
      }
    }
  });

  // App's API Token
  const appToken = await refreshToken(APP_KEY, APP_SECRET);
  console.log(`Update App KIS token ${appToken}`);
  kisApi.updateToken(appToken);
})