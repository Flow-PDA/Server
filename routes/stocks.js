var express = require("express");
var router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");
dotenv.config();

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
const TOKEN = process.env.TOKEN;

const API_KEY = process.env.API_KEY;

let hankookConfig = {
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

// [GET] 신한 - 지금 뜨는 테마
router.get("/hotTheme", jwtAuthenticator, async (req, res, next) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking/rising",
      headers: {
        apiKey: `${API_KEY}`,
      },
    };

    const result = axios
      .request(config)
      .then((response) => {
        return res.status(200).json(response.data.dataBody.list);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ msg: "ERROR MESSAGE" });
      });
  } catch (err) {
    console.error(err);
  }
});

// [GET] 신한 - 마켓 이슈
router.get("/marketIssue", jwtAuthenticator, async (req, res, next) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://gapi.shinhaninvest.com:8443/openapi/v1.0/strategy/market-issue",
      headers: {
        apiKey: `${API_KEY}`,
      },
    };

    const result = axios
      .request(config)
      .then((response) => {
        return res.status(200).json(response.data.dataBody.list);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ msg: "ERROR MESSAGE" });
      });
  } catch (err) {
    console.error(err);
  }
});

// [GET] 신한 - 투자 전략
router.get("/investStrategy", jwtAuthenticator, async (req, res, next) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://gapi.shinhaninvest.com:8443/openapi/v1.0/strategy/invest",
      headers: {
        apiKey: `${API_KEY}`,
      },
    };

    const result = axios
      .request(config)
      .then((response) => {
        return res.status(200).json(response.data.dataBody.list);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ msg: "ERROR MESSAGE" });
      });
  } catch (err) {
    console.error(err);
  }
});

// [GET] 신한 - 핫 이슈
router.get("/hotIssue", jwtAuthenticator, async (req, res, next) => {
  try {
    // tag 타입 지정
    const tag = req.body.tag;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking/issue?query_type=${tag}`,
      headers: {
        apiKey: `${API_KEY}`,
      },
    };

    const result = axios
      .request(config)
      .then((response) => {
        return res.status(200).json(response.data.dataBody);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ msg: "ERROR MESSAGE" });
      });
  } catch (err) {
    console.error(err);
  }
});

// [GET] 주식 매수/매도
// VTTC0802U : 주식 현금 매수 주문
// VTTC0801U : 주식 현금 매도 주문
router.post("/orderStock", jwtAuthenticator, async (req, res, next) => {
  try {
    const tr_id = req.body.tr_id;
    const CANO = req.body.CANO; // 계좌 앞 8자리
    const ACNT_PRDT_CD = req.body.ACNT_PRDT_CD; //계좌 뒤 2자리
    const PDNO = req.body.PDNO; // 종목코드
    const ORD_DVSN = req.body.ORD_DVSN; // 주문구분
    const ORD_QTY = req.body.ORD_QTY; // 주문수량
    const ORD_UNPR = req.body.ORD_UNPR; //주문단가

    let data = JSON.stringify({
      CANO: `${CANO}`,
      ACNT_PRDT_CD: `${ACNT_PRDT_CD}`,
      PDNO: `${PDNO}`,
      ORD_DVSN: `${ORD_DVSN}`,
      ORD_QTY: `${ORD_QTY}`,
      ORD_UNPR: `${ORD_UNPR}`,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${TOKEN}`,
        appkey: `${APP_KEY}`,
        appsecret: `${APP_SECRET}`,
        tr_id: `${tr_id}`,
        hashkey: "",
      },
      data: data,
    };

    const result = axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const resp = response.data.output;
        return res
          .status(201)
          .json({ msg: `${resp.ORD_TMD}에 주문이 완료되었습니다.` });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

//거래 내역 조회
router.get("/transactionHistory", jwtAuthenticator, async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});
module.exports = router;
