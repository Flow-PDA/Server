// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const PartyMember = db.PartyMembers;
const Participant = db.Participants;
const TransactionDetail = db.TransactionDetails;

/**
 * 거래 내역 조회
 * @param {*} partyKey
 * @returns createdAt, stockName, volume, price, name, transactionType (날짜, 주식명, 구매 주식 수, 단가, 구매자, 거래타입)
 */
module.exports.getTransactionDetail = async (partyKey) => {
  try {
    const transactionDetails = await TransactionDetail.findAll({
      where: {
        partyKey: partyKey,
      },
      order: [["createdAt", "DESC"]],
    });

    const returnValues = [];

    for (const transactionDetail of transactionDetails) {
      // user db에서 유저 이름 찾기..
      const userNameFind = await User.findOne({
        where: { userKey: transactionDetail.dataValues.userKey },
      });

      const userName = userNameFind.dataValues.name;

      //주식 db에서 주식 이름 찾기..
      const stockNameFind = await Stock.findOne({
        where: { stockKey: transactionDetail.dataValues.stockKey },
      });

      const stockName = stockNameFind.dataValues.stockName;

      returnValues.push({
        name: userName,
        stockName: stockName,
        createdAt: transactionDetail.createdAt,
        volume: transactionDetail.volume,
        price: transactionDetail.price,
        transactionType: transactionDetail.transactionType,
      });
    }

    return returnValues;
  } catch (error) {
    throw error;
  }
};
