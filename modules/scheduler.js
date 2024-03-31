const schedule = require('node-schedule');
const { refreshToken } = require('../utils/refreshToken');
const { db } = require("./index");
const Party = db.Parties;

const resfreshTokens = schedule.scheduleJob('0 */12 * * *', async function () {
  console.log("shceduler");
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

})