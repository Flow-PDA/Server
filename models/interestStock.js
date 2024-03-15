module.exports = (sequelize, Sequelize) => {
  // define model
  const InterestStock = sequelize.define(
    // DB table name
    "interest_stock",
    {
      interestStockKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "stock",
          key: "stock_key",
        },
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
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // column name : camelCase to snake_case
      underscored: true,
      freezeTableName: true,
      timeStamps: true, // default true
    }
  );

  return InterestStock;
};
