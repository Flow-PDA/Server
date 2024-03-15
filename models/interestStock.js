module.exports = (sequelize, Sequelize) => {
  // define model
  const InterestStock = sequelize.define(
    // DB table name
    "interest_stock",
    {
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "stock",
          key: "stock_key",
        },
        // composite PK
        primaryKey: true,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "party",
          key: "party_key",
        },
        // composite PK
        primaryKey: true,
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
