const axios = require('axios');

const URL = process.env.STOCK_API_URL;

const instance = axios.create({
  baseURL: URL,
})

/**
 * get Stock Price
 * @param {Strign} code Stock code
 * @param {Strign} mode might be minute, day, week, month
 * @param {Strign} from date YYYYMMDDHHMM
 * @param {Strign} to date YYYYMMDDHHMM
 * @returns 
 */
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