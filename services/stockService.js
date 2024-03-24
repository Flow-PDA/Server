// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const PartyMember = db.PartyMembers;
const Participant = db.Participants;

/**
 * 거래 내역 조회
 * @param {*} partyKey
 * @returns 없음
 */
module.exports.getTransactionDetail = async (partyKey) => {
  try {
    const { stockKey, userKey, partyKey } = interestStockDto;

    // const existingInterestStock = await InterestStock.findOne({
    //   where: {
    //     stockKey: stockKey,
    //     partyKey: partyKey,
    //   },
    // });

    // // 이미 존재하는 경우 등록하지 않음
    // if (!existingInterestStock) {
    //   const createdInterestStock = await InterestStock.create({
    //     stockKey: stockKey,
    //     userKey: userKey,
    //     partyKey: partyKey,
    //   });
    //   return createdInterestStock;
    // } else {
    //   console.log("이미 등록된 주식입니다!");
    // }
  } catch (error) {
    throw error;
  }
};
