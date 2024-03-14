var express = require("express");
var router = express.Router();

// without service layer
const { db } = require("../modules/");
const interestStock = db.InterestStocks;

// with service layer
const interestStockService = require("../services/interestStockService.js");

// [POST] 찜 목록 등록
router.post("/interests", async (req, res, next) => {
  try {
    const interestStockDto = req.body;

    // using service layer
    const result = await interestStockService.register(interestStockDto);

    // without service layer
    //const result = await User.create(userDto);

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

// // [GET] get user list - sample
// router.get("/", async (req, res, next) => {
//   try {
//     // without service layer
//     const result = await User.findAll();

//     const resBody = {
//       msg: "조회 결과",
//       result: result,
//     };

//     return res.status(200).json(resBody);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "ERROR MESSAGE" });
//   }
// });

module.exports = router;
