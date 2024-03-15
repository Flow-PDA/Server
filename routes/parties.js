var express = require("express");
var router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
const TOKEN = process.env.TOKEN;

//한투
let data = null;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=50105802&ACNT_PRDT_CD=02&AFHR_FLPR_YN=N&OFL_YN=&INQR_DVSN=01&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=&CTX_AREA_NK100=",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${TOKEN}`,
    appkey: `${APP_KEY}`,
    appsecret:`${APP_SECRET}`,
    tr_id: `${TR_ID}`,
  },
  // data: data,
};

// service not use
// 모임멤버 타입 지정....
const { db } = require("../modules");
const Party = db.Parties;
const PartyMember = db.PartyMembers;
const User = db.Users;

// service use
const partyService = require("../services/partyService.js");

// [Post] 모임 생성하기
router.post("/", async (req, res, next) => {
  try {
    // 모임 생성할 떄 자동으로 party_key 생기는지.
    const partyDto = {
      name: req.body.name,
      accountNumber: req.body.accountNumber,
    };
    const result = await Party.create(partyDto);
    const resBody = {
      msg: "모임 생성",
      result: result,
    };

    return res.status(201).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] 모임 조회하기
router.get("/", async (req, res, next) => {
  try {
    const result = await Party.findAll();
    const resBody = {
      msg: "모임 조회 결과",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] 특정 모임 조회하기
router.get("/:partyKey", async (req, res, next) => {
  try {
    const result = await Party.findOne({
      where: { party_key: req.params.partyKey },
    });
    const resBody = {
      msg: "특정 모임 조회 결과",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);

// [PUT] 특정 모임 정보 설정하기
router.put("/:partyKey/goals", async (req, res, next) => {
  try {
    //한투
    async function fetchData() {
      try {
        const response = await axios.request(config);
        console.log("상태 코드:", response.status);
        return response.data;
      } catch (error) {
        console.log(error);
        throw error; // 에러를 다시 throw하여 호출하는 쪽에서 처리할 수 있도록 합니다.
      }
    }
    fetchData()
      .then((data) => {
        // 비동기적으로 받은 데이터를 처리합니다.
        const tempData = data.output2[0];

        const partyDto = {
          goal: req.body.goal,
          goalPrice: req.body.goalPrice,
          goalDate: req.body.goalDate,
          deposit: parseInt(tempData.dnca_tot_amt),
        };

        const result = Party.update(partyDto, {
          where: { party_key: req.params.partyKey },
        });
        console.log(partyDto);
        console.log(req.params.partyKey);
        const resBody = {
          msg: "모임 정보 설정",
          result: result,
        };
        return res.status(200).json(resBody);
      })
      .catch((error) => {
        // 오류 처리
        console.log("오류 발생:", error);
        return res.status(500).json({ msg: "ERROR MESSAGE" });
      });
    // return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
  }
});

// [DELETE] 특정 모임 삭제하기
router.delete("/:partyKey", async (req, res, next) => {
  try {
    const result = await Party.destroy({
      where: { party_key: req.params.partyKey },
    });
    const resBody = {
      msg: "특정 모임 삭제 결과",
      result: result,
    };

    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});
// [GET] 특정 모임에 속한 모임원들 조회
// API 명세서에 없었는데 필요할 것 같아서 추가했습니다...
//
router.get("/:partyKey/members", async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const result = await PartyMember.findAll({
      where: { party_key: partyKey },
    });

    const resBody = {
      msg: "특정 모임에 속한 모임원 조회",
      result: result,
    };
    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});
//[DELETE] 특정 모임원 내보내기
router.delete("/:partyKey/members", async (req, res, next) => {
  try {
    const userKey = req.body.userKey;
    const partyKey = req.params.partyKey;

    const result = await PartyMember.delete({
      where: { user_key: userKey, party_key: partyKey },
    });
    const resBody = {
      msg: "특정 모임원 삭제 결과",
      result: result,
    };
    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});
module.exports = router;
