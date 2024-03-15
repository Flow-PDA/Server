// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const Party = db.Parties;
const PartyMember = db.Parties;
const Participant = db.Participants;

/**
 * register 찜 목록
 * @param {*} interestStockDto stockKey, partyKey, userKey are required
 * @returns created 찜 목록
 */
module.exports.register = async (interestStockDto) => {
  try {
    const { stockKey, userKey, partyKey } = interestStockDto;

    const createdInterestStock = await InterestStock.create({
      stockKey: stockKey,
      userKey: userKey,
      partyKey: partyKey,
    });

    //나중에 문제 없으면 삭제 필요
    return createdInterestStock;
  } catch (error) {
    throw error;
  }
};

module.exports.vote = async (interestStockDto) => {
  try {
    const { stockKey, userKey, partyKey, isApproved } = interestStockDto;

    let voteParticipant;
    //투표한 사람이 찬성을 누른 경우
    if (isApproved) {
      voteParticipant = await Participant.findOne({
        where: { party_key: partyKey, stock_key: stockKey, user_key: userKey },
      });

      //이미 투표를 했었으면
      if (voteParticipant) {
        //Participant
        await voteParticipant.update({ is_approved: true });
      }

      //투표를 처음하는 거면
      else {
        voteParticipant = await Participant.create({
          stockKey: stockKey,
          userKey: userKey,
          partyKey: partyKey,
          is_approved: true,
        });
      }
    } else {
      //투표한 사람이 반대를 누른 경우
      voteParticipant = await Participant.findOne({
        where: { party_key: partyKey, stock_key: stockKey, user_key: userKey },
      });

      //이미 투표를 했었으면
      if (voteParticipant) {
        //업데이트
        await voteParticipant.update({ is_approved: false });
      }

      //투표를 처음하는 거면
      else {
        //투표 참여자 만들어주기
        voteParticipant = await Participant.create({
          stockKey: stockKey,
          userKey: userKey,
          partyKey: partyKey,
          is_approved: false,
        });
      }
    }

    return voteParticipant;
  } catch (error) {
    throw error;
  }
};

// module.exports.changeApprovalResult = async (interestStockDto) => {
//   try {
//     const { stockKey, userKey, partyKey, isApproved } = interestStockDto;

//     const partyMemberCnt=   await Party_.findOne({
//       where: { party_key: partyKey, stock_key: stockKey, user_key: userKey },
//     });

//     //투표 참여자 전원이 찬성하면 관심 주식이 승인 완료로 바뀌어야함
//     if()

//   } catch (error) {
//     throw error;
//   }
// };

module.exports.getApproval = async (partyKey) => {
  try {
    const interestStock = await InterestStock.findAll({
      where: { party_key: partyKey, is_approved: false },
    });

    if (!interestStock) {
      throw new Error("interestStock not found");
    }

    return interestStock;
  } catch (error) {
    throw error;
  }
};

module.exports.getApproved = async (partyKey) => {
  try {
    const interestStock = await InterestStock.findAll({
      where: { party_key: partyKey, is_approved: true },
    });

    if (!interestStock) {
      throw new Error("interestStock not found");
    }

    return interestStock;
  } catch (error) {
    throw error;
  }
};

module.exports.delApproved = async ({ partyKey, stockKey }) => {
  try {
    const interestStock = await InterestStock.destroy({
      where: { party_key: partyKey, stock_key: stockKey },
    });

    if (!interestStock) {
      throw new Error("interestStock not found");
    }

    //나중에 문제 없으면 삭제 필요
    return { partyKey, stockKey };
  } catch (error) {
    throw error;
  }
};
