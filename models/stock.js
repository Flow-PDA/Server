module.exports = (sequelize, Sequelize) => {
  // define model
  const Stock = sequelize.define(
    // DB table name
    "Stock",
    {
      stockKey: {
        type: Sequelize.STRING(6),
        primaryKey: true,
      },
      stockName: {
        type: Sequelize.STRING(20),
      },

      //나중에 필요 없으면 아래 것들은 삭제
      date: {
        // DATE - DATETIME of MySQL
        type: Sequelize.DATE,
        allowNull: true,
      },
      startPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      endPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      highPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lowPrice: {
        type: Sequelize.INTEGER,
      },
      currentPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fluctuationRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      remainAmount: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      askPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bidPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
