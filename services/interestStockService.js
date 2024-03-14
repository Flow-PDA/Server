// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;

/**
 * register 찜 목록
 * @param {*} interestStockDto stockKey, partyKey, userKey are required
 * @returns created 찜 목록
 */
module.exports.register = async (interestStockDto) => {
  try {
    const { stockKey, userKey } = interestStockDto;

    const stock = await Stock.findOne({ where: { stock_key: stockKey } });
    const user = await User.findOne({ where: { user_key: userKey } });

    if (!stock || !user) {
      throw new Error("Stock or User not found");
    }

    const createdInterestStock = await InterestStock.create({
      stockName: stock.name,
      userName: user.name,
      createdAt: new Date(),
      //isApprovedCnt: participant 되면 계산해야함
    });

    return createdInterestStock;
  } catch (error) {
    throw error;
  }
};
