var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const dotenv = require("dotenv");
const { jwtAuthenticator } = require("../middlewares/authenticator.js");
const { db, kisApi } = require("../modules");
const Parties = db.Parties;

const stockService = require("../services/stockService.js");
dotenv.config();

const APP_KEY = process.env.APP_KEY;
const APP_SECRET = process.env.APP_SECRET;
const TR_ID = process.env.TR_ID;
const TOKEN = process.env.TOKEN;

const API_KEY = process.env.API_KEY;

const { getPartyInfo } = require("../services/partyService.js");
const Stock = db.Stocks;

// let hankookConfig = {
//   method: "get",
//   maxBodyLength: Infinity,
//   url: "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=${CANO}&ACNT_PRDT_CD=02&AFHR_FLPR_YN=N&OFL_YN=&INQR_DVSN=01&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=&CTX_AREA_NK100=",
//   headers: {
//     "content-type": "application/json",
//     authorization: `Bearer ${TOKEN}`,
//     appkey: `${APP_KEY}`,
//     appsecret: `${APP_SECRET}`,
//     tr_id: `${TR_ID}`,
//   },
//   // data: data,
// };
// 네이버 뉴스 크롤링
async function fetchNewsData(stock_name) {
  try {
    const response = await axios.get(
      `https://search.naver.com/search.naver?where=news&query=${stock_name}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        responseType: "arraybuffer",
      }
    );
    const decodeContent = iconv.decode(Buffer.from(response.data), "utf-8");
    const $ = cheerio.load(decodeContent);
    const result = $(".news_area")
      .map((i, el) => {
        const news_title = $(el).find(".news_tit").text();
        const news_content = $(el).find(".news_dsc").text();
        const news_img = $(el).find(".news_contents img").attr("data-lazysrc");
        const news_link = $(el).find(".news_contents .dsc_thumb").attr("href");
        return { news_title, news_content, news_img, news_link };
      })
      .get();
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

// 최근 10개 기사 가져오기
router.get("/news", jwtAuthenticator, async (req, res, next) => {
  try {
    const stock_name = req.query.stock_name;
    // console.log(stock_name);
    const response = await fetchNewsData(stock_name);
    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
  }
});
// DB 에서 주식정보 가져오기
router.get("/stockInfo/:stockKey", async (req, res, next) => {
  try {
    const stockKey = req.params.stockKey;
    const resBody = await stockService.getStockInfo(stockKey);

    return res.status(200).json(resBody);
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      error: "Cannot find Stock Code",
    });
  }
});
//DB에서 전 종목 불러오기
router.get("/all", jwtAuthenticator, async (req, res, next) => {
  try {
    const tmp = [];
    const responses = await Stock.findAll();
    responses.forEach((response) => {
      tmp.push({
        stock_code: response.dataValues.stockKey,
        stock_name: response.dataValues.stockName,
      });
    });
    return res.status(200).json(tmp);
  } catch (err) {
    console.error(err);
  }
});
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
router.get("/hotIssue", async (req, res, next) => {
  try {
    // tag 타입 지정
    const tag = req.query.tag;
    // console.log(tag);
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
        // console.log(response.data.dataBody);
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
// [GET] 주식 현재가 조회 - 찬진
router.get("/inquired", async (req, res, next) => {
  try {
    stock_code = req.query.stock_code;
    // console.log("code:", stock_code);

    console.log(kisApi);
    const response = await kisApi.instance.get(
      `inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stock_code}`
    );

    const resp = response.data.output;
    const resBody = {
      prdy_vrss: resp.prdy_vrss,
      prdy_vrss_sign: resp.prdy_vrss_sign,
      prdy_ctrt: resp.prdy_ctrt,
      stck_prpr: resp.stck_prpr,
    };
    return res.status(200).json(resBody);
  } catch (err) {
    console.error(err);
  }
});
// [GET] 주식 현재가 조회
router.get("/inquire", async (req, res, next) => {
  try {
    const stock_code = req.query.stock_code;

    // const stockKey = req.params.stockKey;
    const resBody = await stockService.getStockInfo(stock_code);

    const stock_name = resBody.dataValues.stockName;

    const response = await kisApi.instance.get(
      `inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${stock_code}`
    );

    console.log(response);
    const resp = response.data.output;
    const respBody = {
      prdy_vrss: resp.prdy_vrss,
      prdy_vrss_sign: resp.prdy_vrss_sign,
      prdy_ctrt: resp.prdy_ctrt,
      stck_prpr: resp.stck_prpr,
      stck_oprc: resp.stck_oprc, //주식 시가

      stockName: stock_name,
    };
    // console.log(resBody);
    return res.status(200).json(respBody);
  } catch (err) {
    console.error(err);
  }
});

// CANO도 바꿔줘야함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!진짜 힘드네여...
// [GET] 현재 잔액 조회
router.post("/inquireDeposit", async (req, res, next) => {
  try {
    const CANO = req.body.CANO;
    const U_APPKEY = req.body.APPKEY;
    const U_APPSECRET = req.body.APPSECRET;
    const U_TOKEN = req.body.TOKEN;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=${CANO}&ACNT_PRDT_CD=02&AFHR_FLPR_YN=N&OFL_YN=&INQR_DVSN=01&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=&CTX_AREA_NK100=`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${U_TOKEN}`,
        appkey: `${U_APPKEY}`,
        appsecret: `${U_APPSECRET}`,
        tr_id: "VTTC8434R",
      },
      // data: data,
    };
    const result = axios
      .request(config)
      .then((response) => {
        // console.log("value:", JSON.stringify(response.data.output2));
        const resp = response.data.output2[0];
        const resBody = {
          dnca_tot_amt: resp.dnca_tot_amt, //총 예수금
          tot_evlu_amt: resp.tot_evlu_amt, //총 평가금액
          pchs_amt_smtl_amt: resp.pchs_amt_smtl_amt, // 매입금액합계
          evlu_amt_smtl_amt: resp.evlu_amt_smtl_amt, //평가금액합계
        };
        return res.status(200).json(resBody);
      })
      .catch((error) => {
        console.log(error);
        const resBody = {
          dnca_tot_amt: "10000000", //총 예수금
          tot_evlu_amt: "10000000", //총 평가금액
          pchs_amt_smtl_amt: "0", // 매입금액합계
          evlu_amt_smtl_amt: "0", //평가금액합계
        };
        return res.status(200).json(resBody);
      });
  } catch (err) {
    console.error(err);
  }
});

// [POST] 주식 매수/매도
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

    const partyKey = req.body.partyKey;
    const stockKey = req.body.stockKey;
    let transactionType = 0;

    const party = await Parties.findOne({
      where: {
        partyKey: partyKey,
      },
    });

    if (tr_id === "VTTC0801U") {
      transactionType = "1";
    }

    let data = JSON.stringify({
      CANO: `${CANO}`,
      ACNT_PRDT_CD: `${ACNT_PRDT_CD}`,
      PDNO: `${PDNO}`,
      ORD_DVSN: `${ORD_DVSN}`,
      ORD_QTY: `${ORD_QTY}`,
      ORD_UNPR: `${ORD_UNPR}`,
    });

    const partyInfo = await getPartyInfo(partyKey).then(
      (res) => res.dataValues
    );

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${partyInfo.token}`,
        appkey: `${partyInfo.appKey}`,
        appsecret: `${partyInfo.appSecret}`,
        tr_id: `${tr_id}`,
        hashkey: "",
      },
      data: data,
    };

    const result = axios
      .request(config)
      .then(async (response) => {
        const msg_cd = response.data.msg_cd;
        const msg1 = response.data.msg1;

        if (msg_cd === "40580000") {
          // console.log(response.data.msg1);
          return res.status(503).json({ msg_cd: msg_cd, msg1: msg1 });
        }

        const resp = response.data.output;

        if (resp) {
          //transaction_detail 추가
          const transaction = await stockService.transact({
            userKey: req.jwt.payload.key,
            partyKey: partyKey,
            stockKey: stockKey,
            price: ORD_UNPR,
            volume: ORD_QTY,
            transactionType: transactionType,
          });

          // console.log("트랜잭션(주식 거래) 추가", transaction);

          //TODO 예수금 잘 바뀌는지 확인 필요
          //파티의 예수금 업데이트
          let config2 = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=${CANO}&ACNT_PRDT_CD=02&AFHR_FLPR_YN=N&OFL_YN=&INQR_DVSN=01&UNPR_DVSN=01&FUND_STTL_ICLD_YN=N&FNCG_AMT_AUTO_RDPT_YN=N&PRCS_DVSN=00&CTX_AREA_FK100=&CTX_AREA_NK100=`,
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${U_TOKEN}`,
              appkey: `${U_APPKEY}`,
              appsecret: `${U_APPSECRET}`,
              tr_id: "VTTC8434R",
            },
            // data: data,
          };

          const total_deposit = await axios
            .request(config2)
            .then((response) => {
              const resp = response.data.output2[0];
              return resp.dnca_tot_amt; // 총 예수금
            });

          // 총 예수금을 받아온 후에 파티의 deposit 수정
          party.deposit = party.transferSum + total_deposit;
          await party.save();
        }

        return res
          .status(201)
          .json({ msg: `${resp.ORD_TMD}에 주문이 완료되었습니다.` });
      })
      .catch((error) => {
        console.log(error);
        throw Error(error);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "ERROR MESSAGE" });
  }
});

//거래 내역 조회
router.get(
  "/:partyKey/transactionDetail",
  jwtAuthenticator,
  async (req, res, next) => {
    try {
      const partyKey = req.params.partyKey;
      const result = await stockService.getTransactionDetail(partyKey);

      const resBody = {
        msg: "거래 내역 조회",
        result: result,
      };

      return res.status(200).json(resBody);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "ERROR MESSAGE" });
    }
  }
);
//주식 잔고 조회 output1
router.get("/:partyKey/balance", jwtAuthenticator, async (req, res, next) => {
  try {
    // const stockKey = req.params.stockKey;
    const partyKey = req.params.partyKey;
    const partyInfo = await getPartyInfo(partyKey); // 계좌 앞 8자리
    const CANO = partyInfo.accountNumber;

    // console.log("CANO", CANO);
    const ACNT_PRDT_CD = "01"; // req.body.ACNT_PRDT_CD; //계좌 뒤 2자리 01
    const AFHR_FLPR_YN = "N";
    const OFL_YN = "";
    const INQR_DVSN = "01";
    const UNPR_DVSN = "01";
    const FUND_STTL_ICLD_YN = "N";
    const FNCG_AMT_AUTO_RDPT_YN = "N";
    const PRCS_DVSN = "00";
    const CTX_AREA_FK100 = "";
    const CTX_AREA_NK100 = "";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/inquire-balance?CANO=${CANO}&ACNT_PRDT_CD=${ACNT_PRDT_CD}&AFHR_FLPR_YN=${AFHR_FLPR_YN}&OFL_YN=${OFL_YN}&INQR_DVSN=${INQR_DVSN}&UNPR_DVSN=${UNPR_DVSN}&FUND_STTL_ICLD_YN=${FUND_STTL_ICLD_YN}&FNCG_AMT_AUTO_RDPT_YN=${FNCG_AMT_AUTO_RDPT_YN}&PRCS_DVSN=${PRCS_DVSN}&CTX_AREA_FK100=${CTX_AREA_FK100}&CTX_AREA_NK100=${CTX_AREA_NK100}`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${partyInfo.token}`,
        appkey: `${partyInfo.appKey}`,
        appsecret: `${partyInfo.appSecret}`,
        tr_id: `VTTC8434R`,
      },
    };

    const result = await axios
      .request(config)
      .then((response) => {
        const output1 = response.data.output1;
        // console.log("아웃풋!!!!!", output1);

        if (!output1) {
          throw new Error("Output1 is undefined in API response");
        }
        const resBody = output1.map((data) => {
          const resData = {
            pdno: data.pdno, // 주식코드
            prdt_name: data.prdt_name, //주식이름
            prpr: data.prpr, // 현재가
            hldg_qty: data.hldg_qty, // 보유수량
            pchs_avg_pric: data.pchs_avg_pric, // 평단가
            pchs_amt: data.pchs_amt, // 매입금액
            evlu_amt: data.evlu_amt, // 평가금액
            evlu_pfls_amt: data.evlu_pfls_amt, //평가손익금액 = 평가금액-매입금액
            evlu_pfls_rt: data.evlu_pfls_rt, // 평가손익율 (%) =특정 시점에서 주식을 매도하여 실현된 손익 또는 이익
            evlu_erng_rt: data.evlu_erng_rt, // 평가수익률 = 현재 보유 중인 자산의 가치 변동에 따라 발생한 이익 또는 손실
          };
          return resData;
        });
        // console.log("야야야야야야", resBody);
        return res.status(200).json(resBody);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//주식 전일 종가 가져오기
router.get(
  "/stockInfo/:stockKey/endPrice",
  jwtAuthenticator,
  async (req, res, next) => {
    const axios = require("axios");

    function getPreviousBusinessDay() {
      const today = new Date();
      let previousDay = new Date(today);

      // If today is Sunday (0) or Monday (1), set previousDay to Friday (5)
      const dayOfWeek = today.getDay();
      if (dayOfWeek === 0) {
        // Sunday
        previousDay.setDate(today.getDate() - 2); // Set to Friday
      } else if (dayOfWeek === 1) {
        // Monday
        previousDay.setDate(today.getDate() - 3); // Set to Friday
      } else {
        previousDay.setDate(today.getDate() - 1); // Set to previous day
      }

      previousDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
      return previousDay;
    }

    // 어제 날짜를 YYYYMMDD 형식의 문자열로 변환하는 함수
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}0000`; //시간 0000으로 설정
    }

    const previousBusinessDay = getPreviousBusinessDay();
    const dateTime = formatDate(previousBusinessDay);
    // console.log(dateTime);

    const stockCode = req.params.stockKey;

    let config = {
      method: "get",
      maxBodyLength: Infinity,

      url: `https://api.stock.naver.com/chart/domestic/item/${stockCode}/day?startDateTime=${dateTime}&endDateTime=${dateTime}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        // console.log("전일 종가", JSON.stringify(response.data));

        return res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

router.get("/stockInfo/:stockKey/price", async (req, res, next) => {
  try {
    const code = req.params.stockKey;
    const mode = req.query.mode;
    const from = req.query.from;
    const to = req.query.to;
    const result = await stockService.getPrice(code, mode, from, to);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    if (error.name === "NoContentError") {
      return res.status(204).json({ msg: error.message });
    }
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
