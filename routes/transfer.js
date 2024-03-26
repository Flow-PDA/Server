var express = require("express");
var router = express.Router();
const { jwtAuthenticator } = require("../middlewares/authenticator.js");
const Transfer = require("../services/transferService.js");
//partyKey, userKey, price, transferType, time, accountNumber, name, deposit art required

//이체 내역 조회 /transfers/:partyKey 10개씩
router.get("/:partyKey", jwtAuthenticator, async (req, res, next) => {
  try {
    const { partyKey } = req.params;
    const transferList = await Transfer.getTransferList(partyKey);
    console.log(transferList);

    res.status(200).json({
      msg: "이체 내역 조회 성공",
      result: transferList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "이체 내역 조회 실패",
    });
  }
});

//이체 /transfers/:partyKey
router.post("/:partyKey", jwtAuthenticator, async (req, res, next) => {
  try {
    const { partyKey } = req.params;
    const { name, accountNumber, price } = req.body;
    const deposit = await Transfer.getPartyDeposit(partyKey);

    const transferDetailDto = {
      partyKey: partyKey,
      userKey: req.jwt.payload.key,
      price: price,
      transferType: 1,
      accountNumber: accountNumber,
      name: name,
      deposit: deposit - price,
      // deposit: deposit - price, // 한투 api에서 예수금을 받아오는건지, 아니면 모임에서 참조한 deposit을 받아오는건지 ?
    };

    console.log(transferDetailDto);

    const recentTransferList = await Transfer.transfer(transferDetailDto);

    res.status(201).json({
      msg: "이체하기 성공",
      result: recentTransferList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "이체하기 실패",
    });
  }
});

//최근 보낸 계좌 리스트 조회 /transfers/:partyKey/recents
router.get("/:partyKey/recents", async (req, res, next) => {
  try {
    const { partyKey } = req.params;
    const transferList = await Transfer.getRecentTransferList(partyKey);

    res.status(200).json({
      msg: "이체 내역 조회 성공",
      result: transferList,
    });
  } catch (error) {
    res.status(500).json({
      msg: "이체 내역 조회 실패",
    });
  }
});

module.exports = router;
