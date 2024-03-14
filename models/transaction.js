module.exports = (sequelize, Sequelize) => {
  //define model
  const Transaction = sequelize.define(
    //DB table name
    "Transaction",
    {
      transactionKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "User",
          key: "user_key",
        },
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Party",
          key: "party_key",
        },
      },
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "Stock",
          key: "stock_key",
        },
      },
      averagePrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      volume: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      transactionType: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      time: {
        type: Sequelize.DATE,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      timeStamps: true,
    }
  );
  return Transaction;
};
