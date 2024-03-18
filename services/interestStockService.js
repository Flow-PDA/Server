// controllers/tutorial.controller.js
const { db } = require("../modules");
const InterestStock = db.InterestStocks;
const Stock = db.Stocks;
const User = db.Users;
const PartyMember = db.PartyMembers;
const Participant = db.Participants;

/**
 * 관심 목록 등록
 * @param {*} interestStockDto stockKey, partyKey, userKey are required
 * @returns 없음
 */
module.exports.register = async (interestStockDto) => {
  try {
    const { stockKey, userKey, partyKey } = interestStockDto;

    const existingInterestStock = await InterestStock.findOne({
      where: {
        stockKey: stockKey,
        partyKey: partyKey,
      },
    });

    // 이미 존재하는 경우 등록하지 않음
    if (!existingInterestStock) {
      const createdInterestStock = await InterestStock.create({
        stockKey: stockKey,
        userKey: userKey,
        partyKey: partyKey,
      });
      return createdInterestStock;
    } else {
      console.log("이미 등록된 주식입니다!");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * vote 투표 기능
 * @param {*} interestStockDto interestStockKey, isApproved, userKey are required
 * @returns 없음
 */
module.exports.vote = async (interestStockDto) => {
  try {
    const { userKey, interestStockKey, partyKey, isApproved } =
      interestStockDto;

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
  } catch (error) {
    throw error;
  }
};

/**
 * changeApprovalResult 관심 주식 승인 여부 변경
 * @param {*} interestStockDto interestStockKey are required
 * @returns 없음
 */

module.exports.changeApprovalResult = async (interestStockDto) => {
  try {
    const { interestStockKey, partyKey } = interestStockDto;

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
  } catch (error) {
    throw error;
  }
};

/**
 * getApproval 승인 중인 관심주식 보기
 * @param {*} partyKey
 * @returns name, stockName, createdAt, partyMemberCnt, participantApprovalCnt
 */

module.exports.getApproval = async (partyKey) => {
  try {
    const interestStocks = await InterestStock.findAll({
      where: { partyKey: partyKey, isApproved: false },
    });

    const returnValues = [];

    for (const interestStock of interestStocks) {
      const stock = await InterestStock.findOne({
        where: { interestStockKey: interestStock.interestStockKey },
      });

      // user db에서 유저 이름 찾기..
      const userNameFind = await User.findOne({
        where: { userKey: stock.dataValues.userKey },
      });

      const userName = userNameFind.dataValues.name;

      //주식 db에서 주식 이름 찾기..
      const stockNameFind = await Stock.findOne({
        where: { stockKey: stock.dataValues.stockKey },
      });

      const stockName = stockNameFind.dataValues.stockName;

      //모임 멤버 수
      const partyMemberCnt = await PartyMember.count({
        where: { partyKey: partyKey },
      });

      //모임 멤버 중 승인자 수
      const participantApprovalCnt = await Participant.count({
        where: {
          interestStockKey: interestStock.interestStockKey,
          isApproved: true,
        },
      });

      returnValues.push({
        name: userName,
        stockName: stockName,
        createdAt: interestStock.createdAt,
        partyMemberCnt: partyMemberCnt,
        participantApprovalCnt: participantApprovalCnt,
      });
    }

    return returnValues;
  } catch (error) {
    throw error;
  }
};

/**
 * getApproval 승인된 관심주식 보기
 * @param {*} partyKey
 * @returns stockName, createdAt,name
 */

module.exports.getApproved = async (partyKey) => {
  try {
    const interestStocks = await InterestStock.findAll({
      where: { partyKey: partyKey, isApproved: true },
    });

    const returnValues = [];

    for (const interestStock of interestStocks) {
      const stock = await InterestStock.findOne({
        where: { interestStockKey: interestStock.interestStockKey },
      });

      // user db에서 유저 이름 찾기..
      const userNameFind = await User.findOne({
        where: { userKey: stock.dataValues.userKey },
      });

      const userName = userNameFind.dataValues.name;

      //주식 db에서 주식 이름 찾기..
      const stockNameFind = await Stock.findOne({
        where: { stockKey: stock.dataValues.stockKey },
      });

      const stockName = stockNameFind.dataValues.stockName;

      returnValues.push({
        name: userName,
        stockName: stockName,
        createdAt: interestStock.createdAt,
      });
    }

    return returnValues;
  } catch (error) {
    throw error;
  }
};

/**
 * delApproved 승인된 관심주식 삭제
 * @param {*} interestStockKey
 * @returns 없음
 */

module.exports.delApproved = async (interestStockKey) => {
  try {
    // 해당 interestStockKey를 가진 모든 Participant 레코드 삭제
    await Participant.destroy({
      where: { interestStockKey: interestStockKey },
    });

    // InterestStock 테이블의 해당 행 삭제
    const interestStock = await InterestStock.destroy({
      where: { interestStockKey: interestStockKey },
    });
  } catch (error) {
    throw error;
  }
};
