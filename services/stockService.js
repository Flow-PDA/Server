// controllers/tutorial.controller.js
const { db } = require("../modules");
const { getStockPrice } = require("../utils/naverStockApi");
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

//주식코드로 주식 정보 얻어오기
module.exports.getStockInfo = async (stockKey) => {
  try {
    if (/^[A-Za-z]/.test(stockKey)) {
      // 주식 코드에 알파벳이 있는 경우
      const stockInfo = await Stock.findOne({
        where: {
          stockKey: stockKey,
        },
      });

      return stockInfo;
    } else {
      // 주식 코드에 알파벳이 없는 경우
      const stockInfo = await Stock.findOne({
        where: {
          stockKey: parseInt(stockKey),
        },
      });
      return stockInfo; // 앞에 붙은 0을 제거하여 문자열로 변환
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * 주식 매수/매도 시 trancsaction Detail 추가
 * create transactionDetail
 * @param {*} transactionDto userKey, partyKey, stockKey, price, volume, transaction_type
 * @returns created TransactionDetail info
 */

module.exports.transact = async (transactionDto) => {
  try {
    const res = await TransactionDetail.create(transactionDto);
    return res.dataValues;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getPrice = async (code, mode, from, to) => {
  try {
    const response = await getStockPrice(code, mode, from, to);
    if (response.length === 0) {
      throw { name: "NoContentError", message: `No content found at ${from}` };
    }

    if (mode === "minute") {
      const stride =
        (response.length / 40).toFixed(0) == 0
          ? 1
          : (response.length / 40).toFixed(0) > 10
            ? 10
            : (response.length / 40).toFixed(0);
      const result = response.filter((elem, index) => {
        return index % stride === 0;
      });
      return result;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
    if (error.name === "NoContentError") throw error;

    throw { name: "APIError", message: error.message };
  }
};
