var express = require("express");
var router = express.Router();

// with service layer
const interestStockService = require("../services/interestStockService.js");

// [POST] 찜 목록 등록
router.post("/", async (req, res, next) => {
  try {
    const interestStockDto = req.body;

    // using service layer
    const result = await interestStockService.register(interestStockDto);

    const resBody = {
      msg: "찜 목록 등록",
      result: result,
    };

    return res.status(201).json(resBody);
  } catch (err) {
    // error handling
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [POST] 투표
router.post("/:interestStockKey", async (req, res, next) => {
  try {
    const interestStockKey = req.params.interestStockKey;

    const interestStockDto = { ...req.body, interestStockKey };

    await interestStockService.vote(interestStockDto);

    const result = await interestStockService.changeApprovalResult(
      interestStockDto
    );

    console.log(result);

    const resBody = {
      msg: "찜 목록 투표",
      result: result,
    };

    return res.status(201).json(resBody);
  } catch (err) {
    // error handling
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] get 승인 중인 list
router.get("/:partyKey/approval", async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const result = await interestStockService.getApproval(partyKey);

    const resBody = {
      msg: "승인 중인 리스트 조회",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] get 승인된 list
router.get("/:partyKey/approved", async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const result = await interestStockService.getApproved(partyKey);

    const resBody = {
      msg: "승인된 리스트 조회",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [DELETE] 승인된 list 빼기
router.delete("/:interestStockKey", async (req, res, next) => {
  try {
    const interestStockKey = req.params.interestStockKey;

    const result = await interestStockService.delApproved(interestStockKey);

    const resBody = {
      msg: "승인된 종목 삭제",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "ERROR MESSAGE: 관심주식 삭제하는데서 오류" });
  }
});

module.exports = router;
