var express = require("express");
var router = express.Router();

const Transfer = require("../services/transferService.js");
//partyKey, userKey, price, transferType, time, accountNumber, name, deposit art required

//이체 내역 조회 /transfers/:partyKey 10개씩
router.get("/:partyKey", async (req, res, next) => {
  try {
    const { partyKey } = req.params;
    const transferList = await Transfer.getTransferList(partyKey);
    console.log(transferList);

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

//이체 /transfers/:partyKey
router.post("/:partyKey", async (req, res, next) => {
  try {
    const { partyKey } = req.params;
    const { userKey, name, accountNumber, price, transferType } = req.body;

    const transferDetailDto = {
      partyKey: partyKey,
      userKey: userKey,
      price: price,
      transferType: transferType,
      accountNumber: accountNumber,
      name: name,
      deposit: deposit, // 한투 api에서 예수금을 받아오는건지, 아니면 모임에서 참조한 deposit을 받아오는건지 ?
    };

    const recentTransferList = await Transaction.transfer(transferDetailDto);

    res.status(201).json({
      msg: "이체하기 성공",
      result: recentTransferList,
    });
  } catch (error) {
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
