module.exports = (sequelize, Sequelize) => {
  // define model
  const InterestStock = sequelize.define(
    // DB table name
    "Interest_Stock",
    {
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "Stock",
          key: "stock_key",
        },
        // composite PK
        primaryKey: true,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "Party",
          key: "party_key",
        },
        // composite PK
        primaryKey: true,
      },
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "User",
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
