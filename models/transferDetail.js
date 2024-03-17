module.exports = (sequelize, Sequelize) => {
  // define model
  const TransferDetail = sequelize.define(
    // DB table name
    "transfer_detail",
    {
      transferKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        // composite PK
        primaryKey: true,
        // defaultValue: 0,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "party",
          key: "party_key",
        },
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "user",
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

  return TransferDetail;
};
