module.exports = (sequelize, Sequelize) => {
  // define model
  const Participant = sequelize.define(
    // DB table name
    "participant",
    {
      userKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "user",
          key: "user_key",
        },
        // composite PK
        primaryKey: true,
      },
      stockKey: {
        type: Sequelize.STRING(6),
        references: {
          model: "interest_stock",
          key: "stock_key",
        },
        // composite PK
        primaryKey: true,
      },
      partyKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "interest_stock",
          key: "party_key",
        },
        // composite PK
        primaryKey: true,
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

  return Participant;
};
