module.exports = (sequelize, Sequelize) => {
  //define model
  const TransactionDetail = sequelize.define(
    //DB table name
    "transaction_detail",
    {
      transactionKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "user",
          key: "user_key",
        },
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "party",
          key: "party_key",
        },
      },
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "stock",
          key: "stock_key",
        },
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      volume: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      //0 for 매수, 1 for 매도
      transactionType: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
      timeStamps: true,
    }
  );
  return TransactionDetail;
};
