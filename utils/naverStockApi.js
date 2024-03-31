const axios = require('axios');

const URL = process.env.STOCK_API_URL;

const instance = axios.create({
  baseURL: URL,
})

async function getDataPerDay(code, from, to) {
  try {
    const resp = await instance.get(`/${code}/day?startDateTime=${from}&endDateTime=${to}`);
    console.log(resp.data);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
}

console.log(getDataPerDay);

module.exports.getDataPerDay = getDataPerDay;