const axios = require('axios');

const URL = process.env.STOCK_API_URL;

const instance = axios.create({
  baseURL: URL,
})

async function getStockPrice(code, mode, from, to) {
  try {
    const resp = await instance.get(`/${code}/${mode}?startDateTime=${from}&endDateTime=${to}`);
    // console.log(resp.data);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports.getStockPrice = getStockPrice;