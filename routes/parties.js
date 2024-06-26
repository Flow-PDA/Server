var express = require("express");
var router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");
const noticeService = require("../services/noticeService.js");
dotenv.config();

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
const TOKEN = process.env.TOKEN;

//한투
// let data = null;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=50105802&ACNT_PRDT_CD=02&AFHR_FLPR_YN=N&OFL_YN=&INQR_DVSN=01&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=&CTX_AREA_NK100=",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${TOKEN}`,
    appkey: `${APP_KEY}`,
    appsecret: `${APP_SECRET}`,
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
async function fetchData() {
  try {
    const response = await axios.request(config);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // 에러를 다시 throw하여 호출하는 쪽에서 처리할 수 있도록 합니다.
  }
}
router.post("/", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    const partyDto = {
      name: req.body.name,
      accountNumber: req.body.accountNumber,
      deposit: 0,
    };

    const result = await Party.create(partyDto);

    const memberDto = {
      partyKey: result.partyKey,
      userKey: userKey, //임시
      role: 1, // 1일 때 관리자
      isAccepted: true, //관리자는 무조건 수락이니까 true
    };

    const memberResult = await PartyMember.create(memberDto);

    const resBody = {
      msg: "모임 생성",
      result: result,
      memberResuslt: memberResult,
    };

    return res.status(201).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// Groups 추가!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// [GET] 모임 조회하기
router.get("/", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
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
// [GET] user 속한 파티
router.get("/user", jwtAuthenticator, async (req, res, next) => {
  try {
    const key = req.jwt.payload;
    return res.status(200).json(key);
  } catch (err) {
    console.error(err);
  }
});
// [GET] 특정 모임 조회하기
router.get("/:partyKey", jwtAuthenticator, async (req, res, next) => {
  try {
    const result = await Party.findOne({
      where: { party_key: req.params.partyKey },
    });
    const key = req.jwt;
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

// [PUT] 특정 모임 정보 설정하기
router.put("/:partyKey/goals", jwtAuthenticator, async (req, res, next) => {
  try {
    const partyDto = {
      goal: req.body.goal,
      goalPrice: req.body.goalPrice,
      goalDate: req.body.goalDate,
    };

    const result = await Party.update(partyDto, {
      where: { party_key: req.params.partyKey },
    });
    const resBody = {
      msg: "모임 정보 설정",
      result: partyDto,
    };
    return res.status(200).json(resBody);
  } catch (error) {
    console.log(error);
    throw error; // 에러를 다시 throw하여 호출하는 쪽에서 처리할 수 있도록 합니다.
  }
});

// [DELETE] 특정 모임 삭제하기
router.delete("/:partyKey", jwtAuthenticator, async (req, res, next) => {
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
router.get("/:partyKey/members", jwtAuthenticator, async (req, res, next) => {
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
// [GET] 유저가 속한 파티 조회
router.get("/:userKey/user", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.params.userKey;
    const result = await PartyMember.findAll({
      where: { user_key: userKey },
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
// [POST] 특정 모임에 일반 멤버 추가
router.post("/:partyKey/members", jwtAuthenticator, async (req, res, next) => {
  try {
    const userKey = req.jwt.payload.key;
    const memberDto = {
      userKey: userKey, //임시
      partyKey: req.params.partyKey,
      role: 0, // 일반 멤버
      isAccepted: true,
    };
    const result = PartyMember.create(memberDto);

    const resBody = {
      msg: "멤버 추가",
      result: `${userKey}가 추가되었습니다.`,
    };
    return res.status(201).json(resBody);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] 모임 역할 확인
router.get("/:partyKey/admin", jwtAuthenticator, async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const userKey = req.jwt.payload.key;
    const result = await PartyMember.findOne({
      where: { party_key: partyKey, user_key: userKey },
    });
    return res.status(200).json(result.dataValues);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

// [GET] 유저 정보 조회
router.post("/:partyKey/user", jwtAuthenticator, async (req, res, next) => {
  try {
    const partyKey = req.params.partyKey;
    const userKey = req.body.userKey;
    const result = await User.findOne({ where: { user_key: userKey } });
    const userDto = {
      userName: result.dataValues.name,
      userKey: result.dataValues.userKey,
    };
    return res.status(201).json(userDto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});
//[DELETE] 특정 모임원 내보내기
router.delete(
  "/:partyKey/members",
  jwtAuthenticator,
  async (req, res, next) => {
    try {
      const userKey = req.query.userKey;
      const result = await PartyMember.destroy({
        where: { user_key: userKey, party_key: req.params.partyKey },
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
  }
);

module.exports = router;
