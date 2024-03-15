module.exports = (sequelize, Sequelize) => {
  // define model
  const Stock = sequelize.define(
    // DB table name
    "stock",
    {
      stockKey: {
        type: Sequelize.STRING(6),
        primaryKey: true,
      },
      stockName: {
        type: Sequelize.STRING(20),
      },
      date: {
        // DATE - DATETIME of MySQL
        type: Sequelize.DATE,
      },
      startPrice: {
        type: Sequelize.INTEGER,
      },
      endPrice: {
        type: Sequelize.INTEGER,
      },
      highPrice: {
        type: Sequelize.INTEGER,
      },
      lowPrice: {
        type: Sequelize.INTEGER,
      },
      currentPrice: {
        type: Sequelize.INTEGER,
      },
      fluctuationRate: {
        type: Sequelize.FLOAT,
      },
      remainAmount: {
        type: Sequelize.BIGINT,
      },
      askPrice: {
        type: Sequelize.INTEGER,
      },
      bidPrice: {
        type: Sequelize.INTEGER,
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return Stock;
};
