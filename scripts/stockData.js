const fs = require("fs");
const db = require("../modules/db.js");
const path = require("path");
const Stock = db.Stocks;

const csvFilePath = path.join(__dirname, "..", "data", "stock_data.csv");

function stockData(csvFilePath) {
  fs.readFile(csvFilePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading CSV file:", err);
      throw err;
    }
    const rows = data
      .trim()
      .split("\n")
      .map((row) => row.split(","));
    for (const row of rows) {
      const code = row[0];
      const name = row[1];
      try {
        await Stock.create({ stockKey: code, stockName: name });
        console.log("Inserted data successfully:", {
          stock_key: code,
          stock_name: name,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    }
  });
}

stockData(csvFilePath);

module.exports = stockData;
