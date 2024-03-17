module.exports = (sequelize, Sequelize) => {
  // define model
  const Participant = sequelize.define(
    // DB table name
    "participant",
    {
      participantKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      partyMemberKey: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: "party_member",
          key: "party_member_key",
        },
      },
      interestStockKey : {
        type : Sequelize.INTEGER.UNSIGNED,
        references : {
          model : "interest_stock",
          key : "interest_stock_key"
        }
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

  return Participant;
};
