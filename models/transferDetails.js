module.exports = (sequelize, Sequelize) => {
  // define model
  const TransferDetails = sequelize.define(
    // DB table name
    "Transfer_Details",
    {
      transferKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        // composite PK
        primaryKey: true,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Party",
          key: "party_key",
        },
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "User",
          key: "user_key",
        },
      },
      price: {
        type: Sequelize.BIGINT,
      },
      // 0 for 입금, 1 for 출금
      transferType: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1,
      },
      accountNumber: {
        type: Sequelize.STRING(20),
      },
      name: {
        type: Sequelize.STRING(10),
      },
      deposit: {
        type: Sequelize.BIGINT,
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return TransferDetails;
};
