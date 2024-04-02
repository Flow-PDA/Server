var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
const iconv = require("iconv-lite");

const kospiUrl =
  "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%BD%94%EC%8A%A4%ED%94%BC";
const kosdaqUrl =
  "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EC%BD%94%EC%8A%A4%EB%8B%A5";
const nasdaqUrl =
  "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&ssc=tab.nx.all&query=%EB%82%98%EC%8A%A4%EB%8B%A5&oquery=%EC%BD%94%EC%8A%A4%ED%94%BC&tqi=iQWpNsqo1LwssMOAiPlsssssscZ-238354";
async function fetchKospiData() {
  try {
    const response = await axios.get(kospiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
    const decodeContent = iconv.decode(Buffer.from(response.data), "EUC-KR");
    const $ = cheerio.load(decodeContent);
    const alpha = $(".spt_con")
      .map((i, el) => {
        const kospi_point = $(el).find("strong").text();
        const change = $(el).find("em").text();
        const value = change.charAt(change.length - 7);
        return {
          kospi_point,
          change,
          value,
        };
      })
      .get();
    return alpha;
  } catch (err) {
    console.error(err);
    return [];
  }
}
async function fetchKosdaqData() {
  try {
    const response = await axios.get(kosdaqUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
    const decodeContent = iconv.decode(Buffer.from(response.data), "EUC-KR");
    const $ = cheerio.load(decodeContent);
    const alpha = $(".spt_con")
      .map((i, el) => {
        const kosdaq_point = $(el).find("strong").text();
        const change = $(el).find("em").text();
        const value = change.charAt(change.length - 7);
        return {
          kosdaq_point,
          change,
          value,
        };
      })
      .get();
    return alpha;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchNasdaqData() {
  try {
    const response = await axios.get(nasdaqUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
    const decodeContent = iconv.decode(Buffer.from(response.data), "EUC-KR");
    const $ = cheerio.load(decodeContent);
    const alpha = $(".spt_con")
      .map((i, el) => {
        const nasdaq_point = $(el).find("strong").text();
        const change = $(el).find("em").text();
        const value = change.charAt(change.length - 7);
        return {
          nasdaq_point,
          change,
          value,
        };
      })
      .get();
    return alpha;
  } catch (err) {
    console.error(err);
    return [];
  }
}

router.get("/kospi", async (req, res, next) => {
  try {
    const tempData = await fetchKospiData();
    return res.status(200).json(tempData);
  } catch (err) {
    console.error(err);
  }
});
router.get("/kosdaq", async (req, res, next) => {
  try {
    const tempData = await fetchKosdaqData();
    return res.status(200).json(tempData);
  } catch (err) {
    console.error(err);
  }
});
router.get("/nasdaq", async (req, res, next) => {
  try {
    const tempData = await fetchNasdaqData();
    return res.status(200).json(tempData);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
