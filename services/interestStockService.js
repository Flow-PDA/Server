// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const Party = db.Parties;
const PartyMember = db.PartyMembers;
const Participant = db.Participants;

/**
 * 관심 목록 등록
 * @param {*} interestStockDto stockKey, partyKey, userKey are required
 * @returns 생성된 관심 목록
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

/**
 * vote 투표 기능
 * @param {*} interestStockDto interestStockKey, isApproved, userKey are required
 * @returns 투표자
 */
module.exports.vote = async (interestStockDto) => {
  try {
    const { userKey, interestStockKey, isApproved } = interestStockDto;

    const party = await InterestStock.findOne({
      where: { interestStockKey: interestStockKey },
    });
    const partyKey = party.dataValues.partyKey;

    const partyMember = await PartyMember.findOne({
      where: { userKey: userKey, partyKey: partyKey },
    });

    const partyMemberKey = partyMember.dataValues.partyMemberKey;
    let voteParticipant;

    voteParticipant = await Participant.findOne({
      where: {
        interestStockKey: interestStockKey,
        partyMemberKey: partyMemberKey,
      },
    });

    if (voteParticipant !== null) {
      // Participant 레코드 업데이트
      await voteParticipant.update({ isApproved: isApproved });
      await voteParticipant.save();
    } else {
      // 투표를 처음하는 경우 새로운 Participant 레코드 생성
      voteParticipant = await Participant.create({
        interestStockKey: interestStockKey,
        partyMemberKey: partyMemberKey,
        isApproved: isApproved,
      });
    }

    //나중에 삭제 필요
    return voteParticipant;
  } catch (error) {
    throw error;
  }
};

/**
 * changeApprovalResult 관심 주식 승인 여부 변경
 * @param {*} interestStockDto interestStockKey are required
 * @returns 관심 주식
 */

module.exports.changeApprovalResult = async (interestStockDto) => {
  try {
    const { interestStockKey } = interestStockDto;

    console.log(interestStockKey);

    const party = await InterestStock.findOne({
      where: { interestStockKey: interestStockKey },
    });
    const partyKey = party.dataValues.partyKey;

    //모임멤버 수
    const partyMemberCnt = await PartyMember.count({
      where: { partyKey: partyKey },
    });

    console.log(partyMemberCnt);

    //찬성한 참여자 수
    const participantApprovalCnt = await Participant.count({
      where: {
        interestStockKey: interestStockKey,
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
          where: { interestStockKey: interestStockKey },
        }
      );
    }

    return InterestStock;
  } catch (error) {
    throw error;
  }
};

/**
 * getApproval 승인 중인 관심주식 보기
 * @param {*} partyKey
 * @returns 승인 중인 관심주식 리스트
 */

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

/**
 * getApproval 승인된 관심주식 보기
 * @param {*} partyKey
 * @returns 승인된 관심주식 리스트
 */

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

/**
 * delApproved 승인된 관심주식 삭제
 * @param {*} interestStockKey
 * @returns 삭제된 관심 주식
 */

module.exports.delApproved = async (interestStockKey) => {
  try {
    console.log(interestStockKey);
    // 해당 interestStockKey를 가진 모든 Participant 레코드 삭제
    await Participant.destroy({
      where: { interestStockKey: interestStockKey },
    });

    // InterestStock 테이블의 해당 행 삭제
    const interestStock = await InterestStock.destroy({
      where: { interestStockKey: interestStockKey },
    });

    //나중에 문제 없으면 삭제 필요
    return interestStock;
  } catch (error) {
    throw error;
  }
};
