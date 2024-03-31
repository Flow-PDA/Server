var express = require("express");
var router = express.Router();
const { jwtAuthenticator } = require("../middlewares/authenticator.js");

// with service layer
const interestStockService = require("../services/interestStockService.js");

// [POST] 관심 목록 등록
router.post("/:partyKey", jwtAuthenticator, async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const interestStockDto = {
      ...req.body,
      partyKey: partyKey,
      userKey: req.jwt.payload.key,
    };
    // using service layer

    await interestStockService.register(interestStockDto);

    const resBody = {
      msg: "관심 목록 등록",
    };

    return res.status(201).json(resBody);
  } catch (err) {
    // error handling
    console.log(err);
    return res.status(500).json({ msg: "ERROR MESSAGE: 관심 목록 등록 오류" });
  }
});

// [POST] 투표
router.post(
  "/:partyKey/:interestStockKey",
  jwtAuthenticator,
  async (req, res, next) => {
    try {
      const interestStockKey = req.params.interestStockKey;
      const partyKey = req.params.partyKey;
      const interestStockDto = {
        ...req.body,
        interestStockKey: interestStockKey,
        partyKey: partyKey,
        userKey: req.jwt.payload.key,
      };

      await interestStockService.vote(interestStockDto);

      await interestStockService.changeApprovalResult(interestStockDto);

      const resBody = {
        msg: "관심 목록 투표",
      };

      return res.status(201).json(resBody);
    } catch (err) {
      // error handling
      console.log(err);
      return res
        .status(500)
        .json({ msg: "ERROR MESSAGE: 관심 목록 투표 오류" });
    }
  }
);

// [GET] get 승인 중인 관심 list
router.get("/:partyKey/approval", jwtAuthenticator, async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const result = await interestStockService.getApproval(partyKey);
    // console.log("didididid", result);
    const resBody = {
      msg: "승인 중인 관심 리스트 조회",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "ERROR MESSAGE: 승인 중인 관심 리스트 get 오류" });
  }
});

// [GET] get 승인된 관심 list
router.get("/:partyKey/approved", jwtAuthenticator, async (req, res, next) => {
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
    return res
      .status(500)
      .json({ msg: "ERROR MESSAGE: 승인된 관심 리스트 get 오류" });
  }
});

// [DELETE] 승인된 관심 종목 빼기
router.delete(
  "/:partyKey/:interestStockKey",
  jwtAuthenticator,
  async (req, res, next) => {
    try {
      const interestStockKey = req.params.interestStockKey;
      await interestStockService.delApproved(interestStockKey);

      const resBody = {
        msg: "승인된 관심 종목 삭제",
      };

      return res.status(200).json(resBody);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ msg: "ERROR MESSAGE: 승인된 관심주식 del 오류" });
    }
  }
);

module.exports = router;
