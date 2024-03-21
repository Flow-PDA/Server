// controllers/tutorial.controller.js
const { db } = require("../modules");
const TransferDetails = db.TransferDetails;
const Parties = db.Parties;

/**
 * create transfer
 * @param {*} TransferDetailDto partyKey, userKey, price, transferType, time, accountNumber, name, deposit art required
 * @returns created Transfer info
 */

//이체하기
module.exports.transfer = async (TransferDetailDto) => {
  const party = await Parties.findOne({
    where: {
      partyKey: TransferDetailDto.partyKey,
    },
  });

  if (!party) {
    throw new Error("파티를 찾을 수 없습니다.");
  }

  console.log(party.transferSum);

  // 파티의 예수금에서 이체 금액을 빼고 저장

  party.deposit -= TransferDetailDto.price;
  console.log(party.deposit);
  await party.save();

  // 이체 상세 정보 생성
  const transferDetail = await TransferDetails.create({
    ...TransferDetailDto,
    deposit: party.deposit,
  });
  const res = {
    name: transferDetail.name,
    accountNumber: transferDetail.accountNumber,
    price: transferDetail.price,
  };

  // console.log(res);
  return res;
};

//이체할때 파티 찾는 함수
module.exports.getPartyDeposit = async (partyKey) => {
  const party = await Parties.findOne({
    where: {
      partyKey: partyKey,
    },
  });

  return party.dataValues.deposit;
};

//이체 내역 10개 조회
module.exports.getTransferList = async (partyKey) => {
  try {
    const transferDetails = await TransferDetails.findAll({
      where: {
        partyKey: partyKey,
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    if (!transferDetails || transferDetails.length === 0) {
      throw new Error("No transaction detail found");
    }

    const res = transferDetails.map((detail) => ({
      name: detail.name,
      createdAt: detail.createdAt,
      price: detail.price,
      deposit: detail.deposit,
      transferKey: detail.transferKey,
    }));

    return res;
  } catch (error) {
    throw error;
  }
};

//최근 보낸 계좌 리스트 조회 /transfers/:partyKey/recents
module.exports.getRecentTransferList = async (partyKey) => {
  try {
    const transferDetails = await TransferDetails.findAll({
      where: {
        partyKey: partyKey,
        transferType: 1, // 0:입금 1:출금
      },

      order: [["createdAt", "DESC"]],
    });

    console.log(transferDetails);

    if (!transferDetails || transferDetails.length === 0) {
      throw new Error("No recent transaction detail found");
    }

    const res = transferDetails.map((detail) => ({
      name: detail.name,
      accountNumber: detail.accountNumber,
      transferKey: detail.transferKey,
    }));

    return res;
  } catch (error) {
    throw error;
  }
};
