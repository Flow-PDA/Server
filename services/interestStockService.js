// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const Party = db.Parties;
const PartyMember = db.PartyMembers;
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
    voteParticipant = await Participant.findOne({
      where: { partyKey: partyKey, stockKey: stockKey, userKey: userKey },
    });

    if (voteParticipant !== null) {
      // Participant 레코드 업데이트

      await voteParticipant.update({ isApproved: isApproved });
      await voteParticipant.save();
    } else {
      // 투표를 처음하는 경우 새로운 Participant 레코드 생성
      voteParticipant = await Participant.create({
        stockKey: stockKey,
        userKey: userKey,
        partyKey: partyKey,
        isApproved: isApproved,
      });
    }

    return voteParticipant;
  } catch (error) {
    throw error;
  }
};

module.exports.changeApprovalResult = async (interestStockDto) => {
  try {
    const { stockKey, userKey, partyKey, isApproved } = interestStockDto;

    //모임멤버 수
    const partyMemberCnt = await PartyMember.count({
      where: { partyKey: partyKey },
    });

    console.log(partyMemberCnt);

    //찬성한 참여자 수
    const participantApprovalCnt = await Participant.count({
      where: {
        partyKey: partyKey,
        stockKey: stockKey,
        isApproved: true,
      },
    });
    console.log(participantApprovalCnt);

    if (partyMemberCnt === participantApprovalCnt) {
      // 투표 참여자 전원이 찬성한 경우
      // 관련된 주식을 찾아서 승인 상태를 변경합니다.
      await InterestStock.update(
        { isApproved: true },
        {
          where: { stockKey: stockKey, partyKey: partyKey },
        }
      );
    }

    return InterestStock;
  } catch (error) {
    throw error;
  }
};

module.exports.getApproval = async (partyKey) => {
  try {
    const interestStock = await InterestStock.findAll({
      where: { partyKey: partyKey, isApproved: false },
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
      where: { partyKey: partyKey, isApproved: true },
    });

    if (!interestStock) {
      throw new Error("interestStock not found");
    }

    return interestStock;
  } catch (error) {
    throw error;
  }
};

// module.exports.delApproved = async ({ partyKey, stockKey }) => {
//   try {
//     // 해당 partyKey와 stockKey를 가진 모든 Participant 레코드 삭제
//     await Participant.destroy({
//       where: { partyKey: partyKey, stockKey: stockKey },
//     });

//     // InterestStock 테이블의 해당 행 삭제
//     const interestStock = await InterestStock.destroy({
//       where: { partyKey: partyKey, stockKey: stockKey },
//     });

//     //나중에 문제 없으면 삭제 필요
//     return { partyKey, stockKey };
//   } catch (error) {
//     throw error;
//   }
// };
